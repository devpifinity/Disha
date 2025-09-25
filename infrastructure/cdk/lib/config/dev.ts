export interface EnvironmentConfig {
  readonly environment: string;
  readonly bucketName: string;
  readonly enableLogging: boolean;
  readonly priceClass: string;
  readonly retainResources: boolean;
  readonly enableVersioning: boolean;
}

export const devConfig: EnvironmentConfig = {
  environment: 'dev',
  bucketName: 'disha-career-platform-dev',
  enableLogging: false, // Disable for cost savings in dev
  priceClass: 'PriceClass100', // Use only US/Europe edge locations for dev
  retainResources: false, // Allow destruction of dev resources
  enableVersioning: false, // No versioning needed for dev
};