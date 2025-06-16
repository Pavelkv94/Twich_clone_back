import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { StorageService } from '@/src/core/modules/storage/storage.service';
import { StorageModule } from '@/src/core/modules/storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [ProfileResolver, ProfileService],
})
export class ProfileModule { }
