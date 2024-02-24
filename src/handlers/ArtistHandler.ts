import { PrismaClient, Artist } from '@prisma/client';

/**
 * ArtistHandler class for managing artist operations.
 */
export class ArtistHandler {
    private prisma: PrismaClient;

    /**
     * Constructs a new ArtistHandler instance.
     * @param {PrismaClient} prisma - The Prisma client for database operations.
     */
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
     * Fetches all artists from the database.
     * @returns {Promise<Artist[]>} A promise that resolves to an array of Artist objects.
     */
    async fetchAllArtists(): Promise<Artist[]> {
        return this.prisma.artist.findMany();
    }

    /**
     * Fetches a specific artist by their ID.
     * @param {number} artistId - The ID of the artist to fetch.
     * @returns {Promise<Artist | null>} A promise that resolves to the Artist object or null if not found.
     */
    async fetchArtistById(artistId: number): Promise<Artist | null> {
        return this.prisma.artist.findUnique({
            where: { id: artistId },
        });
    }

    /**
     * Creates a new artist with the given name.
     * @param {string} name - The name of the artist to create.
     * @returns {Promise<Artist>} A promise that resolves to the newly created Artist object.
     */
    async createArtist(name: string): Promise<Artist> {
        return this.prisma.artist.create({
            data: { name },
        });
    }

    /**
     * Updates the name of an existing artist.
     * @param {number} artistId - The ID of the artist to update.
     * @param {string} newName - The new name for the artist.
     * @returns {Promise<Artist>} A promise that resolves to the updated Artist object.
     */
    async updateArtist(artistId: number, newName: string): Promise<Artist> {
        return this.prisma.artist.update({
            where: { id: artistId },
            data: { name: newName },
        });
    }

    /**
     * Deletes an artist based on their ID.
     * @param {number} artistId - The ID of the artist to delete.
     * @returns {Promise<Artist>} A promise that resolves to the deleted Artist object.
     */
    async deleteArtist(artistId: number): Promise<Artist> {
        return this.prisma.artist.delete({
            where: { id: artistId },
        });
    }
}
