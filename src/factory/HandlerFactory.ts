import { PrismaClient } from '@prisma/client';
import { ArtistHandler } from '../handlers/ArtistHandler';
import { SongHandler } from '../handlers/SongHandler';

export class HandlerFactory {
    private static instance: HandlerFactory;
    private songHandler: SongHandler;
    private artistHandler: ArtistHandler;

    private constructor() {
        const prisma = new PrismaClient();
        this.songHandler = new SongHandler(prisma);
        this.artistHandler = new ArtistHandler(prisma);
    }

    public static getInstance(): HandlerFactory {
        if (!HandlerFactory.instance) {
            HandlerFactory.instance = new HandlerFactory();
        }
        return HandlerFactory.instance;
    }

    public getSongHandler(): SongHandler {
        return this.songHandler;
    }

    public getArtistHandler(): ArtistHandler {
        return this.artistHandler;
    }
}

