import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SendMessageInput } from './inputs/send-message.input';
import { ChatSettingsInput } from './inputs/caht-settings.input';
import { User } from '@/prisma/generated/client';

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    findMessagesByStreamId(streamId: string) {
        const messages = this.prisma.chatMessage.findMany({
            where: {
                streamId,
            },
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                user: true,
            },
        });
        return messages;
    }

    async sendMessage(userId: string, input: SendMessageInput) {
        const { text, streamId } = input;

        const stream = await this.prisma.stream.findUnique({
            where: {
                id: streamId,
            },
        });

        if (!stream) {
            throw new NotFoundException('Stream not found');
        }

        if (!stream.isLive) {
            throw new BadRequestException('Stream is not live');
        }

        const message = await this.prisma.chatMessage.create({
            data: {
                message: text,
                stream: {
                    connect: {
                        id: streamId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
            include: {
                stream: true,
            },
        });

        return message;
    }

    async updateChatSettings(user: User, input: ChatSettingsInput) {
        const { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly } = input;

        await this.prisma.stream.update({
            where: {
                userId: user.id,
            },
            data: {
                isChatEnabled,
                isChatFollowersOnly,
                isChatPremiumFollowersOnly,
            },
        });

        return true;
    }
}
