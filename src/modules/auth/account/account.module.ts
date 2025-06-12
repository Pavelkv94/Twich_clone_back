import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { BcryptService } from '../../../shared/bcrypt.service';

@Module({
  providers: [AccountResolver, AccountService, BcryptService],
})
export class AccountModule { }
