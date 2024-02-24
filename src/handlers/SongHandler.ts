import { PrismaClient, Song } from '@prisma/client';

/**
 * SongHandler class for managing song operations.
 */
export class SongHandler {
    private prisma: PrismaClient;


    /**
     * Constructs a new SongHandler instance.
     * @param {PrismaClient} prisma - The Prisma client for database operations.
     */
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
 * Creates a new song with the given data.
 * @param {string} title - The title of the song.
 * @param {string} url - The URL pointing to the song's external storage.
 * @param {number[]} artistIds - An array of artist IDs associated with the song.
 * @returns {Promise<Song>} A promise that resolves to the newly created Song object.
 */
    async createSong(title: string, url: string, artistIds: number[]): Promise<Song> {
        return this.prisma.song.create({
            data: {
                title: title,
                url: url,
                artists: {
                    connect: artistIds.map(id => ({ id }))
                }
            },
        });
    }


    /**
     * Fetches all songs from the database including associated artists.
     * @returns {Promise<Song[]>} A promise that resolves to an array of Song objects.
     */
    async fetchSongs(): Promise<Song[]> {
        return this.prisma.song.findMany({
            include: {
                artists: true, // Include artist data
            },
        });
    }


    /**
   * Fetches a randomized list of songs from the database.
   * @returns {Promise<Song[]>} A promise that resolves to an array of randomized Song objects.
   */
    async fetchRandomSongs(artistName?: string, take = 100): Promise<Song[]> {
        let whereCondition = {};

        if (artistName) {
            whereCondition = {
                artists: {
                    some: {
                        name: artistName
                    }
                }
            };
        }

        return this.prisma.song.findMany({
            where: whereCondition,
            include: {
                artists: true,
            },
            orderBy: {
                // Use a random function based on your database
                // For PostgreSQL, use the following:
                id: 'asc'
            },
            take, // Change this number to control how many songs are returned
        });
    }

    /**
     * Fetches a specific song by ID, including associated artists.
     * @param {number} songId - The ID of the song to fetch.
     * @returns {Promise<Song | null>} A promise that resolves to the Song object or null if not found.
     */
    async fetchSongById(songId: number): Promise<Song | null> {
        return this.prisma.song.findUnique({
            where: { id: songId },
            include: {
                artists: true, // Include artist data
            },
        });
    }

    /**
     * Updates a song's details.
     * @param {number} songId - The ID of the song to update.
     * @param {Object} data - An object containing the song data to update.
     * @returns {Promise<Song>} A promise that resolves to the updated Song object.
     */
    async updateSong(songId: number, data: { title?: string; url?: string }): Promise<Song> {
        return this.prisma.song.update({
            where: { id: songId },
            data,
        });
    }

    /**
     * Deletes a song based on its ID.
     * @param {number} songId - The ID of the song to delete.
     * @returns {Promise<Song>} A promise that resolves to the deleted Song object.
     */
    async deleteSong(songId: number): Promise<Song> {
        return this.prisma.song.delete({
            where: { id: songId },
        });
    }
}
