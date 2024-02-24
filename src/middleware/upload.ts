import { Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import { ControllerUtils } from '../utils/controller-utils';
import { mimeToFormatMap } from '../Services/adapters/IBucketAdapter';
import AppError from '../utils/appError';

// interface CustomRequest extends Request {
//   files?: Record<string, any>;
// }

export default class UploadController extends ControllerUtils {
  constructor() {
    super();
  }

  public processSongsUploads = catchAsync(
    async (req: any, _res: Response, next: NextFunction): Promise<void> => {

      if (!req.files) {
        return next();
      }

      if (!mimeToFormatMap[req.files[0].mimetype]) {
        req.body.extension = mimeToFormatMap[req.files[0].mimetype];
        return next(new AppError(`Unsupported file type: ${req.files[0].mimetype}`, 400));
      }

      req.body.songsUpload = {
        buffer: req.files[0].buffer,
        extension: req.files[0].mimetype
      };

      next();
    }
  );
}
