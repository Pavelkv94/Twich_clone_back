import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FiltersInput } from './inputs/filters.input';
import { Prisma, User } from '@prisma/generated';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
// import Upload from 'graphql-upload/Upload.js'; //todo change to REST
import sharp from 'sharp';
import { StreamTokenInput } from './inputs/stream-token.input';
import { StreamConfig } from './stream.config';
import { AccessToken } from 'livekit-server-sdk';
import { StorageService } from '@/src/core/modules/storage/storage.service';

@Injectable()
export class StreamService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService,
        private readonly streamConfig: StreamConfig
    ) { }

    async findAll(filters: FiltersInput = {}) {
        const { take = 12, skip = 0, searchTerm } = filters;

        const whereClause: Prisma.StreamWhereInput = searchTerm ? this.findBySearchTerm(searchTerm) : {};

        const streams = await this.prismaService.stream.findMany({
            take,
            skip,
            where: {
                user: {
                    isDeactivated: false,
                },
                ...whereClause,
            },
            include: {
                user: true,
                category: true,
            }
        });

        return streams;
    }

    async findRandomStreams(count: number = 4) {
        const total = await this.prismaService.stream.count({
            where: {
                user: {
                    isDeactivated: false,
                },
            },
        });

        if (total === 0) {
            return [];
        }

        // Generate random indices
        const randomIndices = new Set<number>();
        while (randomIndices.size < count) {
            randomIndices.add(Math.floor(Math.random() * total));
        }

        // Convert to array and sort for efficient querying
        const sortedIndices = Array.from(randomIndices).sort((a, b) => a - b);

        // Fetch all streams and then pick the random ones
        const allStreams = await this.prismaService.stream.findMany({
            where: {
                user: {
                    isDeactivated: false,
                },
            },
            include: {
                user: true,
                category: true,
            },
        });

        // Map the random indices to actual streams
        return sortedIndices.map(index => allStreams[index]).filter(Boolean);
    }

    async changeStreamInfo(user: User, input: ChangeStreamInfoInput) {
        const { title, categoryId } = input;

        await this.prismaService.stream.update({
            where: { userId: user.id },
            data: {
                title,
                category: {
                    connect: {
                        id: categoryId,
                    }
                }
            },
        });

        return true;
    }

    // async changeThumbnail(user: User, file: Upload) {
    //     const stream = await this.findStreamByUserId(user.id);

    //     if (!stream) {
    //         throw new NotFoundException('Stream not found');
    //     }

    //     if (stream.thumbnailUrl) {
    //         await this.storageService.deleteFile(stream.thumbnailUrl);
    //     }

    //     const chunks: Buffer[] = [];
    //     for await (const chunk of file.createReadStream()) {
    //         chunks.push(chunk);
    //     }

    //     const buffer = Buffer.concat(chunks);

    //     const filename = `/streams/${stream.id}.webp`;

    //     if (file.filename && file.mimetype.endsWith('gif')) {
    //         const image = await sharp(buffer, { animated: true }).resize(1280, 720).webp().toBuffer();
    //         await this.storageService.uploadFile(image, filename, 'image/webp');
    //     } else {
    //         const image = await sharp(buffer, { animated: true }).resize(1280, 720).webp().toBuffer();
    //         await this.storageService.uploadFile(image, filename, 'image/webp');
    //     }

    //     await this.prismaService.stream.update({
    //         where: { userId: user.id },
    //         data: { thumbnailUrl: filename },
    //     });

    //     return true;
    // }

    async removeThumbnail(user: User) {
        const stream = await this.findStreamByUserId(user.id);

        if (!stream) {
            throw new NotFoundException('Stream not found');
        }

        if (!stream.thumbnailUrl) {
            return false;
        }

        await this.storageService.deleteFile(stream.thumbnailUrl);

        await this.prismaService.stream.update({
            where: { userId: user.id },
            data: { thumbnailUrl: null },
        });

        return true;
    }

    async generateStreamToken(input: StreamTokenInput) {
        const { userId, channelId } = input;

        let self: { userId: string, username: string };

        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
        });

        if (user) {
            self = { userId: user.id, username: user.username };
        } else {
            self = { userId: userId, username: "John Doe " + Math.random().toString(36).substring(2, 15) };
        }

        const channel = await this.prismaService.user.findUnique({
            where: { id: channelId },
        });

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        const isHost = channel.id === userId;

        const token = new AccessToken(this.streamConfig.livekitApiKey, this.streamConfig.livekitApiSecret, {
            identity: isHost ? `Host-${self.userId}` : self.userId.toString(),
            name: self.username
        });

        token.addGrant({
            room: channel.id,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
        });

        return { token: token.toJwt() };
    }

    private findBySearchTerm(searchTerm: string): Prisma.StreamWhereInput {
        return {
            OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { user: { username: { contains: searchTerm, mode: 'insensitive' } } },
                { category: { title: { contains: searchTerm, mode: 'insensitive' } } },
            ],
        };
    }

    private async findStreamByUserId(userId: string) {
        return this.prismaService.stream.findUnique({
            where: { userId },
        });
    }
}
