import AWS from 'aws-sdk';
import { PutObjectRequest, ListObjectsV2Output, GetObjectOutput } from 'aws-sdk/clients/s3';
import IBucketAdapter from '../IBucketAdapter';


export enum FilesFormat {
  PDF = 'pdf',
  PNG = 'png',
  JPEG = 'jpeg',
  MP3 = 'mp3',
  WAV = 'wav',
  OGG = 'ogg'
}

export default class BucketAdapter implements IBucketAdapter {
  private readonly s3: AWS.S3;

  private readonly bucketName: string;

  private static readonly contentTypeMap: Record<FilesFormat, string> = {
    [FilesFormat.PDF]: 'application/pdf',
    [FilesFormat.PNG]: 'image/png',
    [FilesFormat.JPEG]: 'image/jpeg',
    [FilesFormat.MP3]: 'audio/mpeg',
    [FilesFormat.WAV]: 'audio/wav',
    [FilesFormat.OGG]: 'audio/ogg'
  };

  constructor(s3: AWS.S3, bucketName: string) {
    this.s3 = s3;
    this.bucketName = bucketName;
  }

  async upload(data: string | Buffer, fileName: string, extension: FilesFormat): Promise<string> {
    console.info({ message: `Uploading ${fileName} to S3 bucket` });

    const params: PutObjectRequest = {
      Bucket: this.bucketName,
      Key: `${fileName}.${extension}`,
      Body: typeof data === 'string' ? Buffer.from(data, 'base64') : data,
      ContentType: BucketAdapter.contentTypeMap[extension],
    };

    const response = await this.s3.upload(params).promise();
    console.info({
      message: `Successfully uploaded ${fileName}.${extension} to S3 bucket ${this.bucketName}`,
    });
    return response.Location;
  }

  /**
   * Fetches all objects which filename starts with the given prefix and the content type matches the given extension.
   * Returns an array of data urls encoded in base64.
   * @param prefix
   * @param extension
   */
  async getObjectsByPrefixAndContentType(
    prefix: string,
    extension: FilesFormat
  ): Promise<string[]> {
    console.info({
      message: `Fetching list of objects with prefix '${prefix}' from S3 bucket`,
    });

    const response: ListObjectsV2Output = await this.s3
      .listObjectsV2({
        Bucket: this.bucketName,
        Prefix: prefix,
      })
      .promise();

    const list = response.Contents || [];

    console.info({
      message: `Successfully fetched list of objects with prefix '${prefix}' from S3 bucket: ${list.length} objects found`,
    });

    if (list.length === 0) {
      return [];
    }

    console.info({ message: 'Fetching objects contents from S3 bucket' });

    const objects = await Promise.all(
      list.map((entry: Record<string, any>) =>
        this.s3
          .getObject({
            Bucket: this.bucketName,
            Key: entry.Key as string,
          })
          .promise()
      )
    );

    console.info({
      message: 'Successfully fetched objects contents from S3 bucket',
    });

    const contentType = BucketAdapter.contentTypeMap[extension];

    return objects
      .filter(({ ContentType }: GetObjectOutput) => ContentType === contentType)
      .reduce((result: string[], object: GetObjectOutput) => {
        if (!object.Body) {
          return result;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return [...result, Buffer.from(object.Body).toString('base64')];
      }, []);
  }
}
