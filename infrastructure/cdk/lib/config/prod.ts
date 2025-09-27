export interface EnvironmentConfig {
  readonly environment: string;
  readonly bucketName: string;
  readonly enableLogging: boolean;
  readonly priceClass: string;
  readonly retainResources: boolean;
  readonly enableVersioning: boolean;
}

export const prodConfig: EnvironmentConfig = {
  environment: 'prod',
  bucketName: 'disha-career-platform-prod',
  enableLogging: false, // Disabled due to ACL complexity
  priceClass: 'PriceClassAll', // Use all edge locations for best performance
  retainResources: true, // Retain resources on stack deletion
  enableVersioning: true, // Enable versioning for production safety
};