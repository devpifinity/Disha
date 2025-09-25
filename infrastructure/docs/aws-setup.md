# AWS Setup Guide for Disha Career Platform

This guide walks you through setting up AWS accounts and deploying the infrastructure for the Disha Career Platform.

## Prerequisites

- Two AWS accounts (Development and Production)
- AWS CLI installed and configured
- Node.js 18+ installed
- Git repository access

## Step 1: AWS Account Setup

### Authentication Method Choice

**🔐 AWS SSO (Recommended)**
- More secure than access keys
- Centralized identity management
- Temporary credentials
- Better auditing and compliance
- Multi-factor authentication support

**🗝️ Traditional Access Keys**
- Direct IAM user credentials
- Long-term static keys
- Higher security risk
- Requires manual key rotation

### 1.1 AWS SSO Setup (Recommended)

1. **Set up AWS SSO in your organization**
   - Go to AWS SSO console in your management account
   - Enable AWS SSO
   - Configure identity source (AWS SSO, Active Directory, or External IdP)
   - Create permission sets with AdministratorAccess for both accounts

2. **Configure SSO CLI Access**
   ```bash
   # Configure development profile with SSO
   aws configure sso --profile disha-dev
   # You'll be prompted to enter:
   # - SSO start URL (e.g., https://your-org.awsapps.com/start)
   # - SSO Region (e.g., us-east-1)
   # - Account ID (your 12-digit development account ID)
   # - Role name (e.g., AdministratorAccess)
   # - Default region (e.g., us-east-1)
   # - Default output format (json)
   
   # Configure production profile with SSO  
   aws configure sso --profile disha-prod
   # Enter the same information but with production account ID
   
   # Login to both accounts (if not already logged in during setup)
   aws sso login --profile disha-dev
   aws sso login --profile disha-prod
   ```

3. **Verify SSO Configuration**
   ```bash
   aws sts get-caller-identity --profile disha-dev
   aws sts get-caller-identity --profile disha-prod
   ```

### 1.2 Traditional Access Keys Setup (Alternative)

⚠️ **Note**: Consider using AWS SSO instead for better security.

#### Development Account Setup

1. **Create/Access Development AWS Account**
   - Log into your development AWS account
   - Ensure billing is set up and the account is active

2. **Create IAM User for CDK Deployment**
   ```bash
   # Create IAM user with programmatic access
   aws iam create-user --user-name disha-cdk-deploy-dev
   
   # Attach AdministratorAccess policy (for initial setup)
   aws iam attach-user-policy \
     --user-name disha-cdk-deploy-dev \
     --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
   
   # Create access keys
   aws iam create-access-key --user-name disha-cdk-deploy-dev
   ```

3. **Configure AWS CLI Profile**
   ```bash
   aws configure --profile disha-dev
   # Enter the access keys from step 2
   # Set region: us-east-1
   # Set output format: json
   ```

#### Production Account Setup

Repeat the same steps for your production account:

```bash
# Create IAM user
aws iam create-user --user-name disha-cdk-deploy-prod

# Attach policy
aws iam attach-user-policy \
  --user-name disha-cdk-deploy-prod \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# Create access keys
aws iam create-access-key --user-name disha-cdk-deploy-prod

# Configure profile
aws configure --profile disha-prod
```

## Step 2: Install AWS CDK

```bash
# Install CDK globally
npm install -g aws-cdk

# Verify installation
cdk --version
```

## Step 3: Bootstrap CDK

Bootstrap CDK in both accounts:

```bash
# Bootstrap development account
cdk bootstrap --profile disha-dev

# Bootstrap production account  
cdk bootstrap --profile disha-prod
```

## Step 4: Deploy Infrastructure

### 4.1 Install Dependencies

```bash
cd infrastructure/cdk
npm install
```

### 4.2 Deploy Development Environment

```bash
# Synthesize and review the template
cdk synth --profile disha-dev -c environment=dev

# Deploy development stack
cdk deploy --profile disha-dev -c environment=dev

# Save the outputs - you'll need them for GitHub Actions
```

### 4.3 Deploy Production Environment

```bash
# Synthesize and review the template
cdk synth --profile disha-prod -c environment=prod

# Deploy production stack
cdk deploy --profile disha-prod -c environment=prod

# Save the outputs - you'll need them for GitHub Actions
```

## Step 5: Configure GitHub Repository

### 5.1 Repository Secrets

Add the following secrets to your GitHub repository:

**Development Environment:**
- `AWS_ACCESS_KEY_ID_DEV`: Access key from CDK deployment output
- `AWS_SECRET_ACCESS_KEY_DEV`: Secret key from CDK deployment output

**Production Environment:**
- `AWS_ACCESS_KEY_ID_PROD`: Access key from CDK deployment output
- `AWS_SECRET_ACCESS_KEY_PROD`: Secret key from CDK deployment output

### 5.2 Repository Variables

Add the following variables to your GitHub repository:

**Development Environment:**
- `S3_BUCKET_NAME_DEV`: From CDK output
- `CLOUDFRONT_DISTRIBUTION_ID_DEV`: From CDK output
- `WEBSITE_URL_DEV`: From CDK output

**Production Environment:**
- `S3_BUCKET_NAME_PROD`: From CDK output
- `CLOUDFRONT_DISTRIBUTION_ID_PROD`: From CDK output
- `WEBSITE_URL_PROD`: From CDK output

### 5.3 Environment Protection Rules

1. Go to Settings > Environments in your GitHub repository
2. Create two environments: `development` and `production`
3. For the `production` environment:
   - Add required reviewers
   - Set deployment branch rule to `main` only

## Step 6: Verification

### 6.1 Test Development Deployment

```bash
# Push to develop branch should trigger automatic deployment
git checkout develop
git push origin develop
```

### 6.2 Test Production Deployment

```bash
# Push to main branch should trigger deployment with approval
git checkout main
git push origin main
```

## Security Best Practices

### 6.1 Least Privilege IAM

After successful deployment, replace the AdministratorAccess policies with more restrictive policies:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "s3:*",
        "cloudfront:*",
        "iam:*",
        "lambda:*",
        "logs:*"
      ],
      "Resource": "*"
    }
  ]
}
```

### 6.2 Regular Key Rotation

- Rotate access keys every 90 days
- Use AWS IAM access key rotation guidelines
- Update GitHub secrets when keys are rotated

### 6.3 Monitoring

Set up CloudWatch alarms for:
- Unusual API calls
- Failed deployments
- High CloudFront costs

## SSO Session Management

### Session Lifecycle

AWS SSO sessions have limited lifetimes and will expire. When they expire:

```bash
# Check session status
aws sts get-caller-identity --profile disha-dev

# If expired, you'll see an error. Refresh with:
aws sso login --profile disha-dev
aws sso login --profile disha-prod
```

### Automated Session Refresh

You can create aliases for convenience:

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
alias aws-login-disha='aws sso login --profile disha-dev && aws sso login --profile disha-prod'
alias aws-status-disha='echo "Dev:" && aws sts get-caller-identity --profile disha-dev && echo "Prod:" && aws sts get-caller-identity --profile disha-prod'
```

## Troubleshooting

### Common Issues

1. **SSO Session Expired**
   ```bash
   # Error: The SSO session associated with this profile has expired
   aws sso login --profile disha-dev
   ```

2. **SSO Start URL Issues**
   - Verify the SSO start URL is correct
   - Ensure you have access to the specified accounts
   - Check that permission sets are properly assigned

3. **CDK Bootstrap Fails**
   - Ensure your AWS CLI profile has sufficient permissions
   - Check if the region is correct (us-east-1)
   - For SSO: Verify session is active

4. **Deployment Fails with Bucket Name Conflicts**
   - S3 bucket names must be globally unique
   - Modify bucket names in `dev.ts` and `prod.ts` configs

5. **GitHub Actions Fail**
   - Verify all secrets and variables are correctly set
   - Check AWS credentials have proper permissions
   - Ensure the build artifacts are being uploaded correctly
   - Note: GitHub Actions cannot use SSO, requires traditional access keys

6. **CloudFront Distribution Issues**
   - CloudFront deployments can take 15-20 minutes
   - Check the distribution status in AWS Console

7. **Permission Denied with SSO**
   - Check that your SSO user has the correct permission sets
   - Verify you're assigned to the correct AWS accounts
   - Ensure AdministratorAccess permission set is attached

### Getting Help

- Check AWS CloudFormation events for detailed error messages
- Review GitHub Actions logs for deployment issues
- Consult AWS CDK documentation for construct-specific problems

## Cleanup

To remove all resources (⚠️ **Use with caution**):

```bash
# Destroy development environment
cdk destroy --profile disha-dev -c environment=dev

# Destroy production environment
cdk destroy --profile disha-prod -c environment=prod
```

**Note**: Some resources (like S3 buckets with versioning) may require manual cleanup.