import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface S3WebsiteProps {
  readonly bucketName: string;
  readonly environment: string;
  readonly indexDocument?: string;
  readonly errorDocument?: string;
  readonly enableLogging?: boolean;
}

export class S3Website extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly distributionUrl: string;

  constructor(scope: Construct, id: string, props: S3WebsiteProps) {
    super(scope, id);

    // Create S3 bucket for website content (using OAI, not website hosting)
    this.bucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: props.bucketName,
      // Removed websiteIndexDocument and websiteErrorDocument to use OAI pattern
      publicReadAccess: false, // CloudFront will handle access via OAI
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: props.environment === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      versioned: props.environment === 'prod',
      lifecycleRules: props.environment === 'prod' ? [
        {
          id: 'DeleteOldVersions',
          enabled: true,
          noncurrentVersionExpiration: cdk.Duration.days(30),
        }
      ] : undefined,
    });

    // Create CloudFront distribution with Origin Access Identity (simpler approach)
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for ${props.bucketName}`,
    });

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      comment: `Disha Career Platform - ${props.environment}`,
      defaultBehavior: {
        origin: new origins.S3Origin(this.bucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html', // SPA routing
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html', // SPA routing
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: props.environment === 'prod' 
        ? cloudfront.PriceClass.PRICE_CLASS_ALL 
        : cloudfront.PriceClass.PRICE_CLASS_100,
      enableLogging: false, // Disabled to avoid ACL complexity
    });

    // Grant CloudFront access to the bucket via OAI
    this.bucket.grantRead(originAccessIdentity);

    this.distributionUrl = `https://${this.distribution.distributionDomainName}`;

    // Output important values
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket name for website content',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront distribution ID',
    });

    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: this.distributionUrl,
      description: 'CloudFront distribution URL',
    });

    // Tags
    cdk.Tags.of(this).add('Environment', props.environment);
    cdk.Tags.of(this).add('Project', 'Disha');
    cdk.Tags.of(this).add('Component', 'Website');
  }
}