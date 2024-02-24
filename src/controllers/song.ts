import { NextFunction, Request, Response } from 'express';
import { Song } from '@prisma/client';
import { FilesFormat } from '../Services/adapters/IBucketAdapter';
import { HandlerFactory } from '../factory/HandlerFactory';
import { SongHandler } from '../handlers/SongHandler';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { ControllerUtils } from '../utils/controller-utils';
import { filterObj } from '../utils/filterObj';

export class SongController extends ControllerUtils {
  private songHandler: SongHandler;

  constructor() {
    super();

    const factory = HandlerFactory.getInstance();
    const songHandler = factory.getSongHandler();
    this.songHandler = songHandler;
  }

  public createSong = catchAsync(
    async (req: Request, res: Response, next): Promise<void> => {
      const { title, artistIds, songsBuffer } = (req.body || {}) as {
        title: string;
        artistIds: number[];
        songsBuffer: {
          buffer: Buffer;
          extension: FilesFormat;
        };
      };

      if (!title || !songsBuffer || !artistIds) {
        return next(
          new AppError(
            'Missing required fields: title, url, and artistIds',
            400
          )
        );
      }

      const fileUrls = await this.uploadFiles({
        files: [songsBuffer.buffer],
        format: songsBuffer.extension,
      });
      const newSong = await this.songHandler.createSong(
        title,
        fileUrls[0],
        artistIds
      );

      res.status(201).json({
        message: 'Song created successfully',
        data: newSong,
      });
    }
  );

  public getAllSongs = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const songs = await this.songHandler.fetchSongs();

      res.status(200).json({
        message: 'Success',
        data: songs,
      });
    }
  );

  public getRandomSongs = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const artistName = req.query.artist as string | undefined;
      const songs = await this.songHandler.fetchRandomSongs(artistName);

      res.status(200).json({
        message: 'Success',
        data: songs,
      });
    }
  );

  public getSongById = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const songId = parseInt(req.params.id);
      const song = await this.songHandler.fetchSongById(songId);

      if (!song) {
        return next(new AppError('Song not found', 404));
      }

      res.status(200).json({
        message: 'Success',
        data: song,
      });
    }
  );

  public updateSong = catchAsync(
    async (req: Request, res: Response, next): Promise<void> => {
      const songId = parseInt(req.params.id);

      const filteredBody = filterObj<Song>(
        req.body,
        'id',
        'url',
        'createdAt',
        'updatedAt'
      );
      const updatedSong = await this.songHandler.updateSong(
        songId,
        filteredBody
      );

      if (!updatedSong) {
        return next(new AppError('Song not found or update failed', 404));
      }

      res.status(200).json({
        message: 'Success',
        data: updatedSong,
      });
    }
  );

  public deleteSong = catchAsync(
    async (req: Request, res: Response, next): Promise<void> => {
      const songId = parseInt(req.params.id);
      try {
        const deletedSong = await this.songHandler.deleteSong(songId);
        res.status(200).json({
          message: 'Success',
          data: deletedSong,
        });
      } catch (error) {
        return next(new AppError('Song not found or delete failed', 404));
      }
    }
  );
}
