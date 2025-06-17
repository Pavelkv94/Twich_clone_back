import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamResolver } from './stream.resolver';
import { IngressModule } from './ingress/ingress.module';
import { StreamConfig } from './stream.config';

@Module({
  providers: [StreamResolver, StreamService, StreamConfig],
  imports: [IngressModule],
})
export class StreamModule { }
