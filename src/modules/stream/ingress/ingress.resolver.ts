import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IngressService } from './ingress.service';
import { User } from '@/prisma/generated';
import { IngressInput } from 'livekit-server-sdk';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';

@Resolver('Ingress')
export class IngressResolver {
  constructor(private readonly ingressService: IngressService) { }

  @Mutation(() => Boolean, { name: 'createIngress' })
  @UseGuards(GqlAuthGuard)
  async createIngress(@ExtractUserFromRequest() user: User, @Args('ingressType') ingressType: IngressInput) {
    return this.ingressService.createIngress(user, ingressType);
  }
}
