# Deployment Guide for Disha Career Platform

This guide covers the deployment processes, workflows, and best practices for the Disha Career Platform.

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │    │   GitHub Repo   │
│   (develop)     │    │     (main)      │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          │ Push                 │ Push + Manual Approval
          ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│ Development     │    │  Production     │
│ Environment     │    │  Environment    │
│                 │    │                 │
│ • Auto Deploy   │    │ • Manual Review │
│ • AWS Dev Acct  │    │ • AWS Prod Acct │
│ • Test Features │    │ • Live Site     │
└─────────────────┘    └─────────────────┘
```

## Deployment Workflows

### Development Deployment

**Trigger**: Push to `develop` branch
**Process**: Automatic
**Environment**: AWS Development Account

1. **Quality Checks** (runs first)
   - TypeScript type checking
   - ESLint code quality
   - Build validation
   - Artifact upload

2. **Deployment** (runs after quality checks pass)
   - Download build artifacts
   - Deploy to S3 bucket
   - Invalidate CloudFront cache
   - Deployment summary

### Production Deployment

**Trigger**: Push to `main` branch
**Process**: Manual approval required
**Environment**: AWS Production Account

1. **Quality Checks** (identical to dev)
2. **Manual Approval** (GitHub environment protection)
3. **Production Deployment**
   - Download build artifacts
   - Deploy to S3 bucket
   - Invalidate CloudFront cache
   - Create deployment tag
   - Deployment notification

## Branch Strategy

```
main (production)
├── hotfix/urgent-fix
└── develop (development)
    ├── feature/career-search-ui
    ├── feature/quiz-improvements
    └── bugfix/form-validation
```

### Recommended Git Flow

1. **Feature Development**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   # Make changes
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

2. **Create Pull Request**
   - Target: `develop` branch
   - Review and merge

3. **Development Testing**
   - Automatic deployment to dev environment
   - Test functionality on dev site

4. **Production Release**
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

5. **Production Approval**
   - Manual approval in GitHub Actions
   - Deploy to production

## Deployment Commands

### Manual Deployment (if needed)

**Development:**
```bash
# Build the application
npm run build

# Deploy using AWS CLI
aws s3 sync dist/ s3://disha-career-platform-dev \
  --profile disha-dev \
  --delete

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*" \
  --profile disha-dev
```

**Production:**
```bash
# Build the application
npm run build

# Deploy using AWS CLI
aws s3 sync dist/ s3://disha-career-platform-prod \
  --profile disha-prod \
  --delete

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*" \
  --profile disha-prod
```

### Infrastructure Updates

```bash
cd infrastructure/cdk

# Deploy infrastructure changes to dev
cdk deploy --profile disha-dev -c environment=dev

# Deploy infrastructure changes to prod
cdk deploy --profile disha-prod -c environment=prod
```

## Environment Configuration

### Development Environment
- **URL**: `https://d1234567890.cloudfront.net` (CloudFront default)
- **Purpose**: Feature testing and development
- **Deployment**: Automatic on `develop` branch push
- **Retention**: Build artifacts kept for 7 days
- **Caching**: Shorter cache times for faster iteration

### Production Environment
- **URL**: `https://d0987654321.cloudfront.net` (CloudFront default)
- **Purpose**: Live application serving users
- **Deployment**: Manual approval required
- **Retention**: Permanent with versioning
- **Caching**: Optimized for performance

## Rollback Procedures

### Quick Rollback (Emergency)

1. **Identify Last Good Deployment**
   ```bash
   # Check deployment tags
   git tag -l "deploy-prod-*" | tail -5
   ```

2. **Revert to Previous State**
   ```bash
   # Option 1: Git revert
   git revert HEAD
   git push origin main
   
   # Option 2: Reset to specific commit
   git reset --hard GOOD_COMMIT_HASH
   git push origin main --force
   ```

3. **Trigger Deployment**
   - GitHub Actions will automatically deploy the reverted code
   - Requires manual approval for production

### Infrastructure Rollback

```bash
cd infrastructure/cdk

# View stack events
aws cloudformation describe-stack-events \
  --stack-name disha-career-platform-prod \
  --profile disha-prod

# If needed, destroy and redeploy
cdk destroy --profile disha-prod -c environment=prod
cdk deploy --profile disha-prod -c environment=prod
```

## Monitoring and Alerts

### Deployment Monitoring

1. **GitHub Actions**
   - Monitor workflow runs
   - Check for failed deployments
   - Review deployment logs

2. **AWS CloudWatch**
   - Monitor S3 bucket access
   - Track CloudFront metrics
   - Set up cost alerts

3. **Application Monitoring**
   - Browser console errors
   - Performance metrics
   - User experience tracking

### Setting Up Alerts

```bash
# CloudWatch alarm for 4xx errors
aws cloudwatch put-metric-alarm \
  --alarm-name "DishaProd-4xxErrors" \
  --alarm-description "High 4xx error rate" \
  --metric-name "4xxErrorRate" \
  --namespace "AWS/CloudFront" \
  --statistic "Average" \
  --period 300 \
  --threshold 5.0 \
  --comparison-operator "GreaterThanThreshold" \
  --profile disha-prod
```

## Security Considerations

### Deployment Security

1. **Branch Protection**
   - Require pull request reviews
   - Require status checks to pass
   - Restrict push to protected branches

2. **Environment Secrets**
   - Use GitHub environment secrets
   - Rotate access keys regularly
   - Principle of least privilege

3. **Content Security**
   - Scan for sensitive data before deployment
   - Use `.gitignore` for environment files
   - Validate build artifacts

### AWS Security

1. **IAM Permissions**
   - Separate accounts for dev/prod
   - Minimal required permissions
   - Regular access reviews

2. **S3 Security**
   - Block public access
   - Use CloudFront for content delivery
   - Enable versioning for production

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Check build locally
   npm run typecheck
   npm run lint
   npm run build
   ```

2. **AWS Permission Errors**
   - Verify GitHub secrets are correct
   - Check IAM user permissions
   - Confirm AWS account access

3. **CloudFront Issues**
   - Invalidation can take 10-15 minutes
   - Check distribution status
   - Verify origin configuration

4. **Branch Protection Issues**
   - Ensure required checks pass
   - Verify branch naming conventions
   - Check GitHub environment settings

### Debug Commands

```bash
# Check GitHub Actions locally (using act)
act -j quality-checks

# Validate CDK templates
cd infrastructure/cdk
cdk synth -c environment=dev

# Test AWS credentials
aws sts get-caller-identity --profile disha-dev
```

## Performance Optimization

### Build Optimization

1. **Bundle Analysis**
   ```bash
   # Add to package.json
   "analyze": "npm run build && npx vite-bundle-analyzer dist"
   ```

2. **Caching Strategy**
   - Static assets: 1 year cache
   - index.html: 5 minutes cache
   - API responses: Custom cache headers

3. **CloudFront Configuration**
   - Enable compression
   - Use appropriate price class
   - Configure custom error pages

## Maintenance

### Regular Tasks

1. **Weekly**
   - Review deployment metrics
   - Check for security updates
   - Monitor AWS costs

2. **Monthly**
   - Rotate access keys
   - Review IAM permissions
   - Update dependencies

3. **Quarterly**
   - Security audit
   - Performance review
   - Disaster recovery testing

### Backup Strategy

1. **Code Repository**
   - GitHub provides built-in redundancy
   - Consider additional mirrors if critical

2. **Infrastructure**
   - CDK code in version control
   - Regular CloudFormation exports
   - Document manual configurations

3. **Data**
   - S3 versioning enabled for production
   - Cross-region replication if needed
   - Regular backup verification

## Cost Management

### Development Environment
- **Estimated Cost**: $2-7/month
- **Optimization**: Shorter cache times, single region

### Production Environment  
- **Estimated Cost**: $9-30/month
- **Optimization**: Global CDN, longer cache times

### Cost Monitoring
```bash
# Set up billing alerts
aws budgets create-budget \
  --account-id YOUR_ACCOUNT_ID \
  --budget file://budget.json \
  --profile disha-prod
```

## Next Steps

1. **Custom Domain Setup**
   - Purchase domain
   - Configure Route 53
   - Set up SSL certificates

2. **Advanced Monitoring**
   - Application performance monitoring
   - User analytics
   - Error tracking

3. **CI/CD Improvements**
   - Automated testing
   - Performance budgets
   - Security scanning