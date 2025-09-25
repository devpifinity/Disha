# Disha Career Platform - Infrastructure

This directory contains the AWS infrastructure code and setup scripts for the Disha Career Platform deployment workflow.

## Quick Start

### 🚀 Automated Setup (Recommended)

Run the interactive setup script to configure everything automatically:

```bash
cd infrastructure
./setup-aws.sh
```

The script will:
- Check prerequisites (AWS CLI, Node.js, etc.)
- Guide you through AWS account configuration
- Set up AWS CLI profiles (with SSO support)
- Install and bootstrap AWS CDK
- Deploy infrastructure to both environments
- Provide GitHub configuration instructions

### ✅ Validate Setup

After running the setup script, validate everything is working:

```bash
./validate-setup.sh
```

This will check all components and generate a GitHub configuration file.

### 📖 Manual Setup

If you prefer manual setup, follow the detailed guide:
- [AWS Setup Guide](docs/aws-setup.md) - Step-by-step manual instructions
- [Deployment Guide](docs/deployment-guide.md) - Deployment procedures and workflows

## Scripts Overview

| Script | Purpose | Usage |
|--------|---------|-------|
| `setup-aws.sh` | **Interactive setup** - Automates the entire AWS setup process | `./setup-aws.sh` |
| `validate-setup.sh` | **Validation** - Checks that setup was completed correctly | `./validate-setup.sh` |

## Directory Structure

```
infrastructure/
├── setup-aws.sh              # 🔧 Interactive setup script
├── validate-setup.sh         # ✅ Validation script
├── cdk/                      # AWS CDK infrastructure code
│   ├── bin/disha-app.ts      # CDK app entry point
│   ├── lib/
│   │   ├── disha-stack.ts    # Main infrastructure stack
│   │   ├── constructs/       # Reusable CDK constructs
│   │   └── config/           # Environment configurations
│   ├── package.json          # CDK dependencies
│   └── cdk.json             # CDK configuration
├── docs/                     # Documentation
│   ├── aws-setup.md         # Manual setup guide
│   └── deployment-guide.md  # Deployment procedures
└── README.md                # This file
```

## Infrastructure Components

### AWS Resources Created

**Development Environment:**
- S3 bucket: `disha-career-platform-dev`
- CloudFront distribution (global CDN)
- IAM user for GitHub Actions deployment
- CloudWatch logs and monitoring

**Production Environment:**
- S3 bucket: `disha-career-platform-prod`
- CloudFront distribution (global CDN)
- IAM user for GitHub Actions deployment
- CloudWatch logs and monitoring
- Enhanced security and versioning

### Cost Estimation

| Environment | Monthly Cost |
|-------------|--------------|
| Development | $2-7 |
| Production | $9-30 |

*Costs depend on traffic volume and data transfer*

## Prerequisites

Before running the setup scripts, ensure you have:

- **Two AWS accounts** (development and production)
- **AWS CLI** installed and configured
- **Node.js 18+** and npm
- **Git** repository access
- **Administrative access** to both AWS accounts
- **AWS SSO** configured (recommended) or IAM user access keys

### Install Prerequisites

```bash
# macOS (using Homebrew)
brew install awscli node

# Ubuntu/Debian
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows (using Chocolatey)
choco install awscli nodejs

# Verify installation
aws --version
node --version
npm --version
```

## GitHub Repository Configuration

After running the setup script, configure your GitHub repository:

### 1. Add Secrets

Go to **Settings > Secrets and variables > Actions > Secrets**:

```
AWS_ACCESS_KEY_ID_DEV=<from CDK output>
AWS_SECRET_ACCESS_KEY_DEV=<from CDK output>
AWS_ACCESS_KEY_ID_PROD=<from CDK output>
AWS_SECRET_ACCESS_KEY_PROD=<from CDK output>
```

### 2. Add Variables

Go to **Settings > Secrets and variables > Actions > Variables**:

```
S3_BUCKET_NAME_DEV=disha-career-platform-dev
CLOUDFRONT_DISTRIBUTION_ID_DEV=<from CDK output>
WEBSITE_URL_DEV=<from CDK output>
S3_BUCKET_NAME_PROD=disha-career-platform-prod
CLOUDFRONT_DISTRIBUTION_ID_PROD=<from CDK output>
WEBSITE_URL_PROD=<from CDK output>
```

### 3. Create Environments

Go to **Settings > Environments**:

- **development**: No protection rules (auto-deploy from `develop` branch)
- **production**: Require reviewers, restrict to `main` branch

The validation script generates a complete configuration file at `infrastructure/github-config.md`.

## Common Commands

### CDK Commands

```bash
cd infrastructure/cdk

# Install dependencies
npm install

# Synthesize CloudFormation templates
cdk synth --profile disha-dev -c environment=dev

# Deploy to development
cdk deploy --profile disha-dev -c environment=dev

# Deploy to production
cdk deploy --profile disha-prod -c environment=prod

# View differences before deployment
cdk diff --profile disha-dev -c environment=dev

# Destroy infrastructure (⚠️ Use with caution)
cdk destroy --profile disha-dev -c environment=dev
```

### AWS CLI Commands

```bash
# Check AWS profiles
aws sts get-caller-identity --profile disha-dev
aws sts get-caller-identity --profile disha-prod

# List S3 buckets
aws s3 ls --profile disha-dev
aws s3 ls --profile disha-prod

# Check CloudFront distributions
aws cloudfront list-distributions --profile disha-dev
```

## Deployment Workflow

1. **Development**: Push to `develop` branch → Auto-deploy to dev environment
2. **Production**: Push to `main` branch → Manual approval → Deploy to production

See [Deployment Guide](docs/deployment-guide.md) for detailed workflow information.

## Troubleshooting

### Common Issues

1. **AWS CLI not configured**
   ```bash
   aws configure --profile disha-dev
   aws configure --profile disha-prod
   ```

2. **CDK bootstrap required**
   ```bash
   cdk bootstrap --profile disha-dev
   cdk bootstrap --profile disha-prod
   ```

3. **Bucket name conflicts**
   - Modify bucket names in `cdk/lib/config/dev.ts` and `cdk/lib/config/prod.ts`

4. **GitHub Actions failing**
   - Verify all secrets and variables are set correctly
   - Check AWS credentials have proper permissions

### Getting Help

- Run `./validate-setup.sh` to check configuration
- Check AWS CloudFormation events for detailed error messages
- Review GitHub Actions logs for deployment issues
- Consult [AWS CDK documentation](https://docs.aws.amazon.com/cdk/)

## Security Best Practices

- **Separate AWS accounts** for development and production
- **Least privilege IAM permissions** for GitHub Actions
- **Regular key rotation** (every 90 days)
- **Monitor AWS costs** and set up billing alerts
- **Review access logs** regularly

## Cleanup

To remove all AWS resources:

```bash
cd infrastructure/cdk

# Destroy development environment
cdk destroy --profile disha-dev -c environment=dev

# Destroy production environment
cdk destroy --profile disha-prod -c environment=prod
```

**⚠️ Warning**: This will permanently delete all data. Use with extreme caution, especially for production.

## Support

- **Setup Issues**: Run `./validate-setup.sh` and check the output
- **Deployment Issues**: See [Deployment Guide](docs/deployment-guide.md)
- **AWS Issues**: Check CloudFormation stack events in AWS Console
- **GitHub Actions**: Review workflow logs in repository Actions tab