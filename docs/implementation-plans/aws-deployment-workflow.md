# AWS Deployment Plan for Disha Career Platform

## Architecture Overview
- **Hosting**: S3 + CloudFront (static hosting with CDN)
- **Environments**: Development and Production (separate AWS accounts)
- **Infrastructure**: AWS CDK with TypeScript
- **CI/CD**: GitHub Actions with manual production approval
- **Quality Gates**: Lint, TypeScript check, and build validation

## Infrastructure Structure
```
infrastructure/
├── cdk/
│   ├── bin/
│   │   └── disha-app.ts                 # CDK app entry point
│   ├── lib/
│   │   ├── disha-stack.ts              # Main infrastructure stack
│   │   ├── constructs/
│   │   │   ├── s3-website.ts           # S3 + CloudFront construct
│   │   │   └── deployment-user.ts      # IAM for GitHub Actions
│   │   └── config/
│   │       ├── dev.ts                  # Development environment config
│   │       └── prod.ts                 # Production environment config
│   ├── cdk.json                        # CDK configuration
│   ├── package.json                    # CDK dependencies
│   └── tsconfig.json                   # TypeScript config for CDK
└── docs/
    ├── aws-setup.md                    # AWS account setup guide
    └── deployment-guide.md             # Deployment process documentation
```

## GitHub Actions Workflow
```
.github/
└── workflows/
    ├── deploy-dev.yml                  # Auto-deploy to development
    ├── deploy-prod.yml                 # Manual approval for production
    └── quality-checks.yml              # Reusable quality checks
```

## Key Features
1. **Two-Environment Setup**: Separate dev/prod AWS accounts with isolated resources
2. **Quality Gates**: ESLint, TypeScript checks, and build validation before deployment
3. **Security**: IAM roles with minimal required permissions for GitHub Actions
4. **Monitoring**: CloudWatch logs and CloudFront metrics
5. **Cost Optimization**: S3 lifecycle policies and CloudFront caching strategies
6. **Future-Ready**: Easy path to add custom domain (Route 53 + ACM)

## Deployment Flow
1. Push to `develop` → Auto-deploy to development environment
2. Push to `main` → Trigger production workflow (requires manual approval)
3. Quality checks run on all deployments
4. Build artifacts cached for faster subsequent deployments

## Setup Requirements
- Two AWS accounts (development and production)
- GitHub repository secrets for AWS credentials
- CDK CLI installation and account bootstrapping

## Implementation Steps

### Phase 1: Infrastructure Setup
1. **AWS Account Preparation**
   - Set up development AWS account
   - Set up production AWS account
   - Create IAM users for GitHub Actions in both accounts
   - Bootstrap CDK in both accounts

2. **CDK Infrastructure Code**
   - Create CDK project structure
   - Implement S3 + CloudFront construct
   - Configure environment-specific settings
   - Add IAM roles for deployment

3. **Deploy Infrastructure**
   - Deploy to development account
   - Deploy to production account
   - Verify S3 buckets and CloudFront distributions

### Phase 2: CI/CD Pipeline
1. **GitHub Actions Setup**
   - Create quality checks workflow (lint, typecheck, build)
   - Create development deployment workflow
   - Create production deployment workflow with manual approval
   - Configure repository secrets for AWS credentials

2. **Testing & Validation**
   - Test development deployment pipeline
   - Test production deployment pipeline
   - Verify manual approval process
   - Test rollback procedures

### Phase 3: Monitoring & Documentation
1. **Monitoring Setup**
   - Configure CloudWatch dashboards
   - Set up basic alerting
   - Monitor deployment metrics

2. **Documentation**
   - Create AWS setup guide
   - Document deployment procedures
   - Create troubleshooting guide

## Future Enhancements
- [ ] Custom domain setup with Route 53 and ACM
- [ ] Enhanced monitoring with detailed metrics
- [ ] Automated security scanning
- [ ] Blue-green deployment strategy
- [ ] Infrastructure drift detection
- [ ] Cost monitoring and alerting

## Estimated Timeline
- **Phase 1**: 2-3 days
- **Phase 2**: 1-2 days  
- **Phase 3**: 1 day
- **Total**: 4-6 days

## Cost Estimation
**Development Environment (monthly)**
- S3 storage: ~$1-2
- CloudFront: ~$1-3
- Data transfer: ~$0-2
- **Total**: ~$2-7/month

**Production Environment (monthly)**
- S3 storage: ~$2-5
- CloudFront: ~$5-15 (depends on traffic)
- Data transfer: ~$2-10
- **Total**: ~$9-30/month

This plan provides a production-ready, scalable deployment pipeline that follows AWS best practices while maintaining simplicity for a static React application.