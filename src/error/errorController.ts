import { NextFunction, Request, Response } from 'express';
import logger from '../middleware/logger';

const sendErrorDev = (err: Record<string, any>, _req: Request, res: Response) => {
  logger.error('Error during development:', err);
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    metadata: {
      timestamp: new Date().toISOString(),
    },
  });
};

const handleS3Error = (err: Record<string, any>) => {
  // Handle specific S3 error codes here
  switch (err.code) {
    case 'NoSuchBucket':
      err.statusCode = 404;
      err.message = 'The specified bucket does not exist.';
      break;
    case 'AccessDenied':
      err.statusCode = 403;
      err.message = 'You do not have permission to access the specified resource.';
      break;
    // Add more S3 specific error codes as needed
    default:
      err.statusCode = 500;
      err.message = 'An unexpected S3 error occurred.';
      break;
  }

  logger.error('S3 Error:', err.message); // Log the S3 specific error
  return err;
};

const handlePrismaError = (err: Record<string, any>) => {
  switch (err.code) {
    case 'P2002':
      err.statusCode = 400;
      err.message =
        'The provided data violates a unique constraint in our database. Please check your input and try again.';
      break;
    case 'P2010':
      err.statusCode = 404;
      err.message =
        'The requested record could not be found. It might have been removed or it does not exist.';
      break;
    case 'P2003':
      err.statusCode = 400;
      err.message =
        'The operation violates a foreign key constraint. Please ensure related records exist and try again.';
      break;
    case 'P2009':
      err.statusCode = 429;
      err.message =
        'Too many requests have been made to the database in a short period of time. Please try again later.';
      break;
    case 'P2016':
      err.statusCode = 500;
      err.message =
        'An unexpected error occurred in our database. Our team has been notified and is working on a fix.';
      break;
    case 'P2021':
      err.statusCode = 400;
      err.message =
        'The query references a column that does not exist. Please check your input and try again.';
      break;
    case 'P2025':
      err.statusCode = 500;
      err.message =
        'An unexpected error occurred in our database. Our team has been notified and is working on a fix.';
      break;
    case 'P2001':
      err.statusCode = 400;
      err.message =
        'The operation violates a unique constraint in our database. Please check your input and try again.';
      break;
    case 'P2012':
      err.statusCode = 400;
      err.message =
        'The operation violates a relationship constraint in our database. Please check your input and try again.';
      break;
    case 'P2013':
      err.statusCode = 400;
      err.message =
        'The operation is missing required connected records. Please check your input and try again.';
      break;
    case 'P2014':
      err.statusCode = 400;
      err.message =
        'The operation references a related record that could not be found. Please check your input and try again.';
      break;
    case 'P2015':
      err.statusCode = 500;
      err.message =
        'The database encountered an invalid or unsupported connection strategy. Our team is working on a fix.';
      break;
    case 'P2022':
      err.statusCode = 500;
      err.message =
        'The database encountered an unknown error. Our team has been notified and is working on a fix.';
      break;
    default:
      err.statusCode = 500;
      err.message =
        'An unexpected error occurred. Our team has been notified and is working to resolve the issue.';
      break;
  }

  logger.error('Prisma Error:', err.message);
  return err;
};

const sendErrorProd = (err: Record<string, any>, req: Request, res: Response) => {
  logger.error('Error in production:', err);
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    metadata: {
      timestamp: new Date().toISOString(),
    },
  });
};

export default (err: Record<string, any>, req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };

  if (error?.name) {
    switch (error?.name) {
      case 'PrismaClientKnownRequestError':
        error = handlePrismaError(error);
        break;
      case 'S3Error':
        error = handleS3Error(error);
        break;
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};
