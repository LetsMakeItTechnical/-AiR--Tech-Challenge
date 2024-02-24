import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

// Using environment variables for sensitive data and configurations
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'AKIAIOSFODNN7EXAMPLE';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
const endpoint = process.env.AWS_ENDPOINT || 'http://localhost:9444';

const config = {
  node_env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || '3000',
  cors_origin: process.env.CORS_ORIGIN || '*',
  MusicLibraryServiceBucket: process.env.STORAGE_BUCKET_NAME || 'music_library_service_bucket',
  aws: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    endpoint: endpoint
  }
};

module.exports = config;


export default config;
