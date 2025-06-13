import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver('Account')
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
}
