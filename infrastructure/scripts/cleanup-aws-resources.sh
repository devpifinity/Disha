#!/bin/bash

# AWS Cleanup Script for Disha Career Platform
# This script cleans up failed CDK deployments and orphaned AWS resources
# Usage: ./cleanup-aws-resources.sh [environment] [aws-profile]
# Example: ./cleanup-aws-resources.sh prod my-sso-profile

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-dev}
AWS_PROFILE=${2}
STACK_NAME="disha-career-platform-${ENVIRONMENT}"
BUCKET_NAME="disha-career-platform-${ENVIRONMENT}"
LOGS_BUCKET_NAME="disha-career-platform-${ENVIRONMENT}-logs"
AWS_REGION="us-east-1"

# Function to prompt for AWS profile if not provided
get_aws_profile() {
    if [[ -z "${AWS_PROFILE}" ]]; then
        echo -e "${YELLOW}📋 Available AWS profiles:${NC}"
        aws configure list-profiles 2>/dev/null || echo -e "${YELLOW}No profiles found. Make sure AWS CLI is configured.${NC}"
        echo
        
        read -p "Enter AWS profile name (or press Enter to use default): " AWS_PROFILE
        
        if [[ -z "${AWS_PROFILE}" ]]; then
            echo -e "${BLUE}Using default AWS profile${NC}"
            unset AWS_PROFILE
        else
            echo -e "${BLUE}Using AWS profile: ${AWS_PROFILE}${NC}"
        fi
    else
        echo -e "${BLUE}Using AWS profile: ${AWS_PROFILE}${NC}"
    fi
}

# Function to set AWS CLI options
set_aws_options() {
    if [[ -n "${AWS_PROFILE}" ]]; then
        AWS_CLI_OPTS="--profile ${AWS_PROFILE}"
        export AWS_PROFILE
    else
        AWS_CLI_OPTS=""
    fi
}

echo -e "${BLUE}🧹 AWS Cleanup Script for Disha Career Platform${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Stack Name: ${STACK_NAME}${NC}"
echo -e "${BLUE}Region: ${AWS_REGION}${NC}"
echo

# Get AWS profile
get_aws_profile
set_aws_options
echo

# Function to check if AWS CLI is configured
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI first.${NC}"
        exit 1
    fi

    echo -e "${YELLOW}🔐 Checking AWS credentials...${NC}"
    if [[ -n "${AWS_PROFILE}" ]]; then
        echo -e "${BLUE}Checking AWS SSO login status for profile: ${AWS_PROFILE}${NC}"
        
        # Check if SSO login is needed
        if ! aws sts get-caller-identity ${AWS_CLI_OPTS} &> /dev/null; then
            echo -e "${YELLOW}⚠️  AWS SSO session expired or not logged in.${NC}"
            echo -e "${BLUE}🔑 Attempting AWS SSO login...${NC}"
            
            aws sso login ${AWS_CLI_OPTS} || {
                echo -e "${RED}❌ AWS SSO login failed.${NC}"
                echo -e "${YELLOW}Please run: aws sso login --profile ${AWS_PROFILE}${NC}"
                exit 1
            }
        fi
    else
        if ! aws sts get-caller-identity ${AWS_CLI_OPTS} &> /dev/null; then
            echo -e "${RED}❌ AWS CLI not configured or no valid credentials found.${NC}"
            echo -e "${YELLOW}Please run 'aws configure' or 'aws sso login' to set up your credentials.${NC}"
            exit 1
        fi
    fi

    echo -e "${GREEN}✅ AWS CLI configured successfully${NC}"
    aws sts get-caller-identity ${AWS_CLI_OPTS} --query '[Account,Arn]' --output table
    echo
}

# Function to delete S3 bucket
delete_s3_bucket() {
    local bucket_name=$1
    
    echo -e "${YELLOW}🗑️  Checking S3 bucket: ${bucket_name}${NC}"
    
    if aws s3api head-bucket --bucket "${bucket_name}" ${AWS_CLI_OPTS} 2>/dev/null; then
        echo -e "${YELLOW}📦 Bucket ${bucket_name} exists. Deleting...${NC}"
        
        # First, delete all objects and versions
        echo -e "${BLUE}  • Deleting all objects...${NC}"
        aws s3 rm "s3://${bucket_name}" --recursive ${AWS_CLI_OPTS} || true
        
        # Delete all object versions if versioning is enabled
        echo -e "${BLUE}  • Deleting all object versions...${NC}"
        aws s3api delete-objects --bucket "${bucket_name}" ${AWS_CLI_OPTS} --delete "$(aws s3api list-object-versions --bucket "${bucket_name}" ${AWS_CLI_OPTS} --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}' --max-items 1000)" 2>/dev/null || true
        
        # Delete all delete markers
        echo -e "${BLUE}  • Deleting delete markers...${NC}"
        aws s3api delete-objects --bucket "${bucket_name}" ${AWS_CLI_OPTS} --delete "$(aws s3api list-object-versions --bucket "${bucket_name}" ${AWS_CLI_OPTS} --query '{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}' --max-items 1000)" 2>/dev/null || true
        
        # Finally, delete the bucket
        echo -e "${BLUE}  • Deleting bucket...${NC}"
        aws s3api delete-bucket --bucket "${bucket_name}" --region "${AWS_REGION}" ${AWS_CLI_OPTS}
        
        echo -e "${GREEN}✅ Successfully deleted S3 bucket: ${bucket_name}${NC}"
    else
        echo -e "${GREEN}✅ S3 bucket ${bucket_name} does not exist (nothing to delete)${NC}"
    fi
    echo
}

# Function to delete CloudFormation stack
delete_cloudformation_stack() {
    echo -e "${YELLOW}🗑️  Checking CloudFormation stack: ${STACK_NAME}${NC}"
    
    local stack_status
    stack_status=$(aws cloudformation describe-stacks --stack-name "${STACK_NAME}" ${AWS_CLI_OPTS} --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo "DOES_NOT_EXIST")
    
    if [[ "${stack_status}" != "DOES_NOT_EXIST" ]]; then
        echo -e "${YELLOW}📚 Stack ${STACK_NAME} exists with status: ${stack_status}${NC}"
        
        if [[ "${stack_status}" == "ROLLBACK_COMPLETE" || "${stack_status}" == "CREATE_FAILED" || "${stack_status}" == "ROLLBACK_FAILED" ]]; then
            echo -e "${BLUE}  • Stack is in failed state, deleting...${NC}"
            aws cloudformation delete-stack --stack-name "${STACK_NAME}" ${AWS_CLI_OPTS}
            
            echo -e "${BLUE}  • Waiting for stack deletion to complete...${NC}"
            aws cloudformation wait stack-delete-complete --stack-name "${STACK_NAME}" ${AWS_CLI_OPTS} || true
            
            echo -e "${GREEN}✅ Successfully deleted CloudFormation stack: ${STACK_NAME}${NC}"
        else
            echo -e "${YELLOW}⚠️  Stack is in ${stack_status} state. You may need to manually delete it from the AWS Console.${NC}"
        fi
    else
        echo -e "${GREEN}✅ CloudFormation stack ${STACK_NAME} does not exist (nothing to delete)${NC}"
    fi
    echo
}

# Function to clean up orphaned CloudFront distributions
cleanup_cloudfront() {
    echo -e "${YELLOW}🗑️  Checking for orphaned CloudFront distributions...${NC}"
    
    local distributions
    distributions=$(aws cloudfront list-distributions ${AWS_CLI_OPTS} --query "DistributionList.Items[?Comment && contains(Comment, 'Disha Career Platform - ${ENVIRONMENT}')].{Id:Id,Comment:Comment,Status:Status}" --output table 2>/dev/null || echo "")
    
    if [[ -n "${distributions}" && "${distributions}" != *"None"* ]]; then
        echo -e "${YELLOW}🌐 Found CloudFront distributions for ${ENVIRONMENT}:${NC}"
        echo "${distributions}"
        echo -e "${YELLOW}⚠️  Note: CloudFront distributions must be manually disabled and deleted from AWS Console${NC}"
        echo -e "${YELLOW}⚠️  This can take 15-30 minutes as they need to be disabled first${NC}"
    else
        echo -e "${GREEN}✅ No orphaned CloudFront distributions found${NC}"
    fi
    echo
}

# Function to clean up orphaned IAM resources
cleanup_iam() {
    echo -e "${YELLOW}🗑️  Checking for orphaned IAM resources...${NC}"
    
    local iam_user="disha-github-actions-${ENVIRONMENT}"
    
    # Check for IAM user
    if aws iam get-user --user-name "${iam_user}" ${AWS_CLI_OPTS} &>/dev/null; then
        echo -e "${YELLOW}👤 Found IAM user: ${iam_user}${NC}"
        
        # Detach policies
        echo -e "${BLUE}  • Detaching policies...${NC}"
        local attached_policies
        attached_policies=$(aws iam list-attached-user-policies --user-name "${iam_user}" ${AWS_CLI_OPTS} --query 'AttachedPolicies[].PolicyArn' --output text)
        for policy_arn in ${attached_policies}; do
            aws iam detach-user-policy --user-name "${iam_user}" --policy-arn "${policy_arn}" ${AWS_CLI_OPTS} || true
        done
        
        # Delete inline policies
        echo -e "${BLUE}  • Deleting inline policies...${NC}"
        local inline_policies
        inline_policies=$(aws iam list-user-policies --user-name "${iam_user}" ${AWS_CLI_OPTS} --query 'PolicyNames[]' --output text)
        for policy_name in ${inline_policies}; do
            aws iam delete-user-policy --user-name "${iam_user}" --policy-name "${policy_name}" ${AWS_CLI_OPTS} || true
        done
        
        # Delete access keys
        echo -e "${BLUE}  • Deleting access keys...${NC}"
        local access_keys
        access_keys=$(aws iam list-access-keys --user-name "${iam_user}" ${AWS_CLI_OPTS} --query 'AccessKeyMetadata[].AccessKeyId' --output text)
        for access_key in ${access_keys}; do
            aws iam delete-access-key --user-name "${iam_user}" --access-key-id "${access_key}" ${AWS_CLI_OPTS} || true
        done
        
        # Delete user
        echo -e "${BLUE}  • Deleting IAM user...${NC}"
        aws iam delete-user --user-name "${iam_user}" ${AWS_CLI_OPTS}
        
        echo -e "${GREEN}✅ Successfully deleted IAM user: ${iam_user}${NC}"
    else
        echo -e "${GREEN}✅ No orphaned IAM user found${NC}"
    fi
    echo
}

# Main execution
main() {
    echo -e "${RED}⚠️  WARNING: This will permanently delete AWS resources!${NC}"
    echo -e "${YELLOW}Resources to be deleted for environment '${ENVIRONMENT}':${NC}"
    echo -e "${YELLOW}  • S3 bucket: ${BUCKET_NAME}${NC}"
    echo -e "${YELLOW}  • S3 logs bucket: ${LOGS_BUCKET_NAME}${NC}"
    echo -e "${YELLOW}  • CloudFormation stack: ${STACK_NAME}${NC}"
    echo -e "${YELLOW}  • Any orphaned CloudFront distributions${NC}"
    echo -e "${YELLOW}  • Any orphaned IAM resources${NC}"
    echo
    
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🚫 Operation cancelled${NC}"
        exit 0
    fi
    
    echo -e "${GREEN}🚀 Starting cleanup process...${NC}"
    echo
    
    # Check AWS CLI configuration
    check_aws_cli
    
    # Delete S3 buckets first (they might prevent stack deletion)
    delete_s3_bucket "${BUCKET_NAME}"
    delete_s3_bucket "${LOGS_BUCKET_NAME}"
    
    # Delete CloudFormation stack
    delete_cloudformation_stack
    
    # Clean up orphaned resources
    cleanup_cloudfront
    cleanup_iam
    
    echo -e "${GREEN}🎉 Cleanup completed successfully!${NC}"
    echo -e "${GREEN}You can now re-run the CDK deployment.${NC}"
}

# Show usage if help is requested
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "Usage: $0 [environment] [aws-profile]"
    echo
    echo "Cleans up failed CDK deployments and orphaned AWS resources."
    echo "Supports AWS SSO profiles for authentication."
    echo
    echo "Arguments:"
    echo "  environment    The environment to clean up (dev/prod). Default: dev"
    echo "  aws-profile    AWS profile name for SSO authentication (optional)"
    echo
    echo "Examples:"
    echo "  $0 dev                    # Clean up dev environment, prompt for profile"
    echo "  $0 prod my-sso-profile    # Clean up prod using specific SSO profile"
    echo "  $0 prod                   # Clean up prod, prompt for profile"
    echo
    echo "Note: If no profile is specified, the script will:"
    echo "  1. Show available AWS profiles"
    echo "  2. Prompt you to select one"
    echo "  3. Automatically handle AWS SSO login if needed"
    echo
    exit 0
fi

# Validate environment parameter
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo -e "${RED}❌ Invalid environment: ${ENVIRONMENT}${NC}"
    echo -e "${YELLOW}Valid environments: dev, prod${NC}"
    exit 1
fi

# Run main function
main