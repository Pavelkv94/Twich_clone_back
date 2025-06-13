import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationsConfig } from './notifications.config';
import { EmailService } from './email.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: (mailerConfig: NotificationsConfig) => ({
                transport: {
                    host: mailerConfig.smtp_host,
                    port: Number(mailerConfig.smtp_port),
                    auth: {
                        user: mailerConfig.smtp_user,
                        pass: mailerConfig.smtp_password,
                    },
                },
                defaults: {
                    from: mailerConfig.smtp_user,
                },
            }),
            inject: [NotificationsConfig],
            extraProviders: [NotificationsConfig], //? без этого не работает
        }),
    ],
    exports: [EmailService],
    providers: [EmailService, NotificationsConfig],
})
export class NotificationsModule { }
