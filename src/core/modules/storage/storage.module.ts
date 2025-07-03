import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageConfig } from './storage.confg';

@Global()
@Module({
    providers: [StorageService, StorageConfig],
    exports: [StorageService],
})
export class StorageModule { }
