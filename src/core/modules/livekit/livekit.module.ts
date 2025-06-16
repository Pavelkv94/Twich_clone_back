import { DynamicModule, Global, Module } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { LiveKitAsyncOptions, LiveKitOptions } from './types/livekit.types';
import { LiveKitOptionsSymbol } from './types/livekit.types';
import { LivekitConfig } from './livekit.config';

// Делаем самописный модуль для Livekit, чтобы не использовать сторонние библиотеки
@Global()
@Module({})
export class LivekitModule {
  static forRoot(options: LiveKitOptions): DynamicModule {
    return {
      module: LivekitModule,
      providers: [
        { provide: LiveKitOptionsSymbol, useValue: options },
        LivekitService,
      ],
      exports: [LivekitService],
    };
  }

  static forRootAsync(options: LiveKitAsyncOptions): DynamicModule {
    return {
      module: LivekitModule,
      imports: options.imports || [],
      providers: [
        {
          provide: LiveKitOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        LivekitService,
        LivekitConfig,
      ],
      exports: [LivekitService],
    };
  }
}
