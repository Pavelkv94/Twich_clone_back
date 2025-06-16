import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TotpService } from './totp.service';
import { EnableTotpInput } from './inputs/enable-totp.input';
import { TotpModel } from './models/totp.model';
import { User } from '@/prisma/generated';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';

@Resolver('Totp')
@UseGuards(GqlAuthGuard)
export class TotpResolver {
  constructor(private readonly totpService: TotpService) { }


  @Query(() => TotpModel, { name: 'generateTotpSecret' })
  async generateTotpSecret(@ExtractUserFromRequest() user: User): Promise<TotpModel> {
    return this.totpService.generateTotpSecret(user);
  }

  @Mutation(() => Boolean, { name: 'enableTotp' })
  async enableTotp(@ExtractUserFromRequest() user: User, @Args('input') input: EnableTotpInput): Promise<boolean> {
    return this.totpService.enableTotp(user, input);
  }

  @Mutation(() => Boolean, { name: 'disableTotp' })
  async disableTotp(@ExtractUserFromRequest() user: User): Promise<boolean> {
    return this.totpService.disableTotp(user);
  }
}
