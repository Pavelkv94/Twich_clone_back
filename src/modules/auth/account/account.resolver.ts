import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ChangePassInput } from './inputs/change-pass.input';
import { ChangeEmailInput } from './inputs/change-email.input';
import { User } from '@/prisma/generated/client';
import { GqlThrottlerGuard } from '@/src/shared/guards/throttler.guard';

@Resolver('Account')
@UseGuards(GqlThrottlerGuard)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserModel, { name: 'getMe' })
  async getMe(@ExtractUserFromRequest('id') id: string) {
    return this.accountService.getMe(id);
  }

  @Mutation(() => UserModel, { name: 'createAccount' })
  async create(@Args('input') input: CreateUserInput) {
    return this.accountService.create(input);
  }

  @Mutation(() => Boolean, { name: 'changeEmail' })
  @UseGuards(GqlAuthGuard)
  async changeEmail(@Args('input') input: ChangeEmailInput, @ExtractUserFromRequest() user: User) {
    return this.accountService.changeEmail(input, user);
  }

  @Mutation(() => Boolean, { name: 'changePass' })
  @UseGuards(GqlAuthGuard)
  async changePass(@Args('input') input: ChangePassInput, @ExtractUserFromRequest() user: User) {
    return this.accountService.changePass(input, user);
  }
}
