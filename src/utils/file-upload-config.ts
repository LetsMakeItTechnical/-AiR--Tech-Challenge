import multer, { FileFilterCallback, StorageEngine } from 'multer';
import fs from 'fs';



function fileFilter(req: Express.Request, file: Express.Multer.File | undefined, callback: FileFilterCallback): void {
    let errorMessage = '';

    if (!file || file.mimetype !== 'video/mp4') {
        errorMessage = `Wrong file type "${file?.originalname.split('.').pop()}" found. Only mp4 video files are allowed!`;
    }

    if (errorMessage) {
        return callback({ errorMessage: errorMessage, code: 'LIMIT_FILE_TYPE' } as any, false);
    }

    callback(null, true);
}

function destinationPath(req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void): void {
    try {
        fs.statSync(process.env.FILE_UPLOAD_PATH!);
    } catch (err) {
        fs.mkdirSync(process.env.FILE_UPLOAD_PATH!);
    }
    callback(null, process.env.FILE_UPLOAD_PATH!);
}

function fileNameConvention(req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void): void {
    callback(null, Date.now() + '-' + file.originalname.replace(/ /g, '_'));
}

const limits = {
    fileSize: parseInt(process.env.FILE_SIZE!) * 1024 * 1024 // 200MB
};

const storage: StorageEngine = multer.diskStorage({
    destination: destinationPath,
    filename: fileNameConvention
});

const fileUploadConfig = {
    fileFilter: fileFilter,
    storage: storage,
    limits: limits
};

export { fileUploadConfig };
