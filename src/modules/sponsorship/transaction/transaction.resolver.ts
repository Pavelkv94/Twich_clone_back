import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { TransactionModel } from './models/transaction.model';
import { User } from '@/prisma/generated/client';
import { MakePaymentModel } from './models/make-payment.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';

@Resolver('Transaction')
@UseGuards(GqlAuthGuard)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) { }

  @Query(() => [TransactionModel], { name: 'findMyTransactions' })
  async myTransactions(@ExtractUserFromRequest() user: User) {
    return this.transactionService.myTransactions(user);
  }

  @Mutation(() => MakePaymentModel, { name: 'makePayment' })
  async makePayment(@ExtractUserFromRequest() user: User, @Args('planId') planId: string) {
    return this.transactionService.makePayment(user, planId);
  }
}
