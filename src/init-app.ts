import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CoreEnvConfig } from "./core/config/core-env.config";
import { DynamicModule } from "@nestjs/common";

export const initAppModule = async (): Promise<DynamicModule> => {
    // Делаем это для того, чтобы получить конфигурацию из переменных окружения и донастроить модуль AppModule до его запуска
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);
    await appContext.close();

    return AppModule.forRoot(config);
};