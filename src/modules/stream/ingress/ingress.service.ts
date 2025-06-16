import { User } from '@/prisma/generated';
import { LivekitService } from '@/src/core/modules/livekit/livekit.service';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIngressOptions, IngressAudioEncodingPreset, IngressInput, IngressVideoEncodingPreset } from 'livekit-server-sdk';

@Injectable()
export class IngressService {
    constructor(private readonly livekitService: LivekitService, private readonly prismaService: PrismaService) { }

    async createIngress(user: User, ingressType: IngressInput): Promise<boolean> {
        await this.resetIngress(user);

        const options: CreateIngressOptions = {
            name: user.username,
            roomName: user.id,
            participantName: user.username,
            participantIdentity: user.id,
        };

        if (ingressType === IngressInput.WHIP_INPUT) {
            options.bypassTranscoding = true;
        } else {
            options.video = {
                source: 1,
                preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
            };
            options.audio = {
                source: 1,
                preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
            };
        }

        const ingress = await this.livekitService.ingress.createIngress(ingressType, options);

        if (!ingress || !ingress.url || !ingress.streamKey) {
            throw new BadRequestException('Failed to create ingress');
        }

        await this.prismaService.stream.update({
            where: {
                userId: user.id,
            },
            data: {
                ingressId: ingress.ingressId,
                serverUrl: ingress.url,
                streamKey: ingress.streamKey,
            },
        });

        return true;
    }

    private async resetIngress(user: User) {
        const ingresses = await this.livekitService.ingress.listIngress({
            roomName: user.id
        });

        const rooms = await this.livekitService.room.listRooms([user.id]);

        for (const room of rooms) {
            await this.livekitService.room.deleteRoom(room.name);
        }

        for (const ingress of ingresses) {
            if (ingress.ingressId) {
                await this.livekitService.ingress.deleteIngress(ingress.ingressId);
            }
        }

        await this.prismaService.stream.update({
            where: {
                userId: user.id,
            },
            data: {
                ingressId: null,
            },
        });
    }
}
