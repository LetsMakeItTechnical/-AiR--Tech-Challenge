// seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Define seed data
        const artistsData = [
            { name: 'Artist 1' },
            { name: 'Artist 2' },
        ];

        const songsData = [
            { title: 'Song 1', url: 'https://example.com/song1.mp3', artistNames: ['Artist 1'] },
            { title: 'Song 2', url: 'https://example.com/song2.mp3', artistNames: ['Artist 2'] },
        ];

        // Seed artists
        const artists = await Promise.all(artistsData.map(artist => prisma.artist.create({ data: artist })));

        // Seed songs
        for (const song of songsData) {
            const artistIds = song.artistNames.map(artistName => artists.find(artist => artist.name === artistName)?.id);
            await prisma.song.create({
                data: {
                    title: song.title,
                    url: song.url,
                    artists: {
                        connect: artistIds.map(artistId => ({ id: artistId })),
                    },
                },
            });
        }

        console.log('Seed data inserted successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma Client
    }
}

main();
