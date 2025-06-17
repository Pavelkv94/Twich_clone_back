import { LivekitService } from '@/src/core/modules/livekit/livekit.service';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
    constructor(private readonly livekitService: LivekitService, private readonly prismaService: PrismaService) { }

    async receiveWebhookLivekit(body: any, authHeader: string) {
        const event = await this.livekitService.receiver.receive(body, authHeader, true); //* true - not safe

        if (!event) {
            throw new BadRequestException('Invalid webhook');
        }
        if (event.event === 'ingress_started') {

            console.log('STREAM STARTED');

            await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId
                },
                data: {
                    isLive: true
                }
            })
        }

        if (event.event === 'ingress_ended') {
            console.log('Stream ended');
            await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId
                },
                data: {
                    isLive: false
                }
            })
        }
    }
}
