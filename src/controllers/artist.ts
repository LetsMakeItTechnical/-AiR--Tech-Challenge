import { NextFunction, Request, Response } from 'express';
import { ArtistHandler } from '../handlers/ArtistHandler';
import catchAsync from '../utils/catchAsync';
import { HandlerFactory } from '../factory/HandlerFactory';
import AppError from '../utils/appError';
import { ControllerUtils } from '../utils/controller-utils';

export class ArtistController extends ControllerUtils {
    private artistHandler: ArtistHandler;

    constructor() {
        super();

        const factory = HandlerFactory.getInstance();
        const artistHandler = factory.getArtistHandler();
        this.artistHandler = artistHandler;
    }

    public getAllArtists = catchAsync(async (_req: Request, res: Response): Promise<void> => {
        const artists = await this.artistHandler.fetchAllArtists();

        res.status(200).json({
            message: 'Success',
            data: artists,
        });
    });

    public getArtistById = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const artistId = parseInt(req.params.id);
        const artist = await this.artistHandler.fetchArtistById(artistId);

        if (!artist) {
            return next(new AppError('Artist not found', 404));
        }

        res.status(200).json({
            message: 'Success',
            data: artist,
        });
    });

    public createArtist = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { name } = req.body;

        if (!name) {
            return next(new AppError('Artist name is required', 400));
        }

        const newArtist = await this.artistHandler.createArtist(name);
        res.status(201).json({
            message: 'Artist created successfully',
            data: newArtist,
        });
    });

    public updateArtist = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const artistId = parseInt(req.params.id);
        const { newName } = req.body;
        if (!newName) {
            return next(new AppError('New artist name is required', 400));
        }
        const updatedArtist = await this.artistHandler.updateArtist(artistId, newName);
        if (!updatedArtist) {
            return next(new AppError('Artist not found or update failed', 404));
        }
        res.status(200).json({
            message: 'Artist updated successfully',
            data: updatedArtist,
        });
    });

    public deleteArtist = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const artistId = parseInt(req.params.id);
        try {
            const deletedArtist = await this.artistHandler.deleteArtist(artistId);
            res.status(200).json({
                message: 'Artist deleted successfully',
                data: deletedArtist,
            });
        } catch (error) {
            return next(new AppError('Artist not found or delete failed', 404));
        }
    });

}
