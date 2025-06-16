import { Module } from '@nestjs/common';
import { IngressService } from './ingress.service';
import { IngressResolver } from './ingress.resolver';
import { LivekitModule } from '@/src/core/modules/livekit/livekit.module';
import { LivekitService } from '@/src/core/modules/livekit/livekit.service';

@Module({
  imports: [LivekitModule],
  providers: [IngressResolver, IngressService],
})
export class IngressModule { }
