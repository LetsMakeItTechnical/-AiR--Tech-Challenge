import FilesInteractor from '../Services/interactor/FileInteractor/Files';
import { FilesFormat, createStorageBucketAdapter } from '../Services/adapters/IBucketAdapter';




export type TUploadFiles = ({ files, format, vendorId }: {
  files: Buffer[];
  format?: FilesFormat.JPEG;
  vendorId?: string;
}) => Promise<string[]>


export class ControllerUtils {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  protected async uploadFiles({ files, format = FilesFormat.JPEG, vendorId = 'storage' }: { files: Buffer[], format: FilesFormat, vendorId?: string }) {
    const bucketAdapter = await createStorageBucketAdapter();
    const filesInteractor = new FilesInteractor(bucketAdapter);

    return filesInteractor.uploadFiles({
      files,
      format,
      refNo: crypto.randomUUID(),
      vendorId,
    });
  }

}
