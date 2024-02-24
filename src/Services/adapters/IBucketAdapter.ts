import AWS from 'aws-sdk';
import BucketAdapter, { FilesFormat } from './BucketAdapter/BucketAdapter';
import config from '../../config/config';
export { FilesFormat } from './BucketAdapter/BucketAdapter';

export const mimeToFormatMap: Record<string, FilesFormat> = {
  'application/pdf': FilesFormat.PDF,
  'image/png': FilesFormat.PNG,
  'image/jpeg': FilesFormat.JPEG,
  'audio/mpeg': FilesFormat.MP3,
  'audio/wav': FilesFormat.WAV,
  'audio/ogg': FilesFormat.OGG
};

const MusicLibraryServiceBucket = config.MusicLibraryServiceBucket;

export default interface IBucketAdapter {
  upload(data: string | Buffer, fileName: string, extension: FilesFormat): Promise<string>;
  getObjectsByPrefixAndContentType(prefix: string, extension: FilesFormat): Promise<string[]>;
};

// Using environment variables for sensitive data
const accessKeyId = config.aws.accessKeyId; // Replace 'fallbackAccessKeyId' with your actual fallback value
const secretAccessKey = config.aws.secretAccessKey; // Replace 'fallbackSecretAccessKey' with your actual fallback value
const endpoint = config.aws.endpoint;

const s3Config = config.node_env === 'local' ? {
  accessKeyId,
  secretAccessKey,
  endpoint,
  s3ForcePathStyle: true, // Required for S3 Ninja
  signatureVersion: 'v4',
} : {};


export function createStorageBucketAdapter(): BucketAdapter {
  console.info('createStorageBucketAdapter');
  AWS.config.update({ region: 'eu-west-1' });

  return new BucketAdapter(
    new AWS.S3(s3Config),
    MusicLibraryServiceBucket
  );
}

