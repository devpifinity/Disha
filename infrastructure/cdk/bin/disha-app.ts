#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DishaStack } from '../lib/disha-stack';
import { devConfig } from '../lib/config/dev';
import { prodConfig } from '../lib/config/prod';

const app = new cdk.App();

// Get environment from context or default to 'dev'
const environment = app.node.tryGetContext('environment') || 'dev';

// Select configuration based on environment
const config = environment === 'prod' ? prodConfig : devConfig;

// Create stack with environment-specific settings
new DishaStack(app, `DishaStack-${config.environment}`, {
  config,
  env: {
    // Use account and region from environment or CDK defaults
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1', // us-east-1 for CloudFront
  },
  description: `Disha Career Platform - ${config.environment} environment`,
  stackName: `disha-career-platform-${config.environment}`,
  tags: {
    Project: 'Disha',
    Environment: config.environment,
    ManagedBy: 'CDK',
  },
});