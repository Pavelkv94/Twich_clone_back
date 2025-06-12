import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) { }

  @Query(() => [UserModel], { name: 'findAllAccounts' })
  async findAll() {
    return this.accountService.findAll();
  }

  @Mutation(() => UserModel, { name: 'createAccount' })
  async create(@Args('input') input: CreateUserInput) {
    return this.accountService.create(input);
  }
}
