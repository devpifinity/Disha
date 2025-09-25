import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';

export interface DeploymentUserProps {
  readonly environment: string;
  readonly bucket: s3.Bucket;
  readonly distribution: cloudfront.Distribution;
}

export class DeploymentUser extends Construct {
  public readonly user: iam.User;
  public readonly accessKey: iam.AccessKey;

  constructor(scope: Construct, id: string, props: DeploymentUserProps) {
    super(scope, id);

    // Create IAM user for GitHub Actions
    this.user = new iam.User(this, 'GitHubActionsUser', {
      userName: `disha-github-actions-${props.environment}`,
      path: '/github-actions/',
    });

    // Create access key for the user
    this.accessKey = new iam.AccessKey(this, 'AccessKey', {
      user: this.user,
    });

    // Create policy for S3 bucket operations
    const s3Policy = new iam.Policy(this, 'S3Policy', {
      policyName: `disha-s3-deployment-${props.environment}`,
      statements: [
        // Allow listing bucket contents
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            's3:ListBucket',
            's3:GetBucketLocation',
            's3:GetBucketVersioning',
          ],
          resources: [props.bucket.bucketArn],
        }),
        // Allow uploading, downloading, and deleting objects
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            's3:GetObject',
            's3:PutObject',
            's3:DeleteObject',
            's3:PutObjectAcl',
          ],
          resources: [props.bucket.arnForObjects('*')],
        }),
      ],
    });

    // Create policy for CloudFront operations
    const cloudFrontPolicy = new iam.Policy(this, 'CloudFrontPolicy', {
      policyName: `disha-cloudfront-deployment-${props.environment}`,
      statements: [
        // Allow creating invalidations
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'cloudfront:CreateInvalidation',
            'cloudfront:GetInvalidation',
            'cloudfront:ListInvalidations',
          ],
          resources: [`arn:aws:cloudfront::${cdk.Stack.of(this).account}:distribution/${props.distribution.distributionId}`],
        }),
        // Allow getting distribution info
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'cloudfront:GetDistribution',
            'cloudfront:GetDistributionConfig',
          ],
          resources: [`arn:aws:cloudfront::${cdk.Stack.of(this).account}:distribution/${props.distribution.distributionId}`],
        }),
      ],
    });

    // Attach policies to user
    this.user.attachInlinePolicy(s3Policy);
    this.user.attachInlinePolicy(cloudFrontPolicy);

    // Output the access key ID (secret will be stored separately)
    new cdk.CfnOutput(this, 'AccessKeyId', {
      value: this.accessKey.accessKeyId,
      description: 'Access Key ID for GitHub Actions',
    });

    new cdk.CfnOutput(this, 'SecretAccessKey', {
      value: this.accessKey.secretAccessKey.unsafeUnwrap(),
      description: 'Secret Access Key for GitHub Actions (store securely)',
    });

    new cdk.CfnOutput(this, 'UserArn', {
      value: this.user.userArn,
      description: 'IAM User ARN',
    });

    // Tags
    cdk.Tags.of(this).add('Environment', props.environment);
    cdk.Tags.of(this).add('Project', 'Disha');
    cdk.Tags.of(this).add('Component', 'Deployment');
    cdk.Tags.of(this).add('Purpose', 'GitHubActions');
  }
}