import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';

export enum MailPurpose {
    ACTIVATION = 'activationAcc',
    PASSWORD_RECOVERY = 'passwordRecovery',
    DEACTIVATE_ACCOUNT = 'deactivateAccount',
    DELETE_ACCOUNT = 'deleteAccount',
    VERIFIED_ACCOUNT = 'verifiedAccount',
    ENABLE_TWO_FACTOR = 'enableTwoFactor',
}

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService, private configService: ConfigService) { }

    async sendEmail(email: string, code: string, purpose: MailPurpose): Promise<void> {
        const template = {
            name: '',
            subject: '',
        }
        switch (purpose) {
            case MailPurpose.ACTIVATION:
                template.name = 'activation';
                template.subject = 'Account activation!';
                break;
            case MailPurpose.PASSWORD_RECOVERY:
                template.name = 'passwordRecovery';
                template.subject = 'Password Recovery!';
                break;
            case MailPurpose.DEACTIVATE_ACCOUNT:
                template.name = 'deactivateAccount';
                template.subject = 'Deactivate Account!';
                break;
            case MailPurpose.DELETE_ACCOUNT:
                template.name = 'deleteAccount';
                template.subject = 'Delete Account!';
                break;
            case MailPurpose.VERIFIED_ACCOUNT:
                template.name = 'verifiedAccount';
                template.subject = 'Verified Account!';
                break;
            case MailPurpose.ENABLE_TWO_FACTOR:
                template.name = 'enableTwoFactor';
                template.subject = 'Enable Two-Factor Authentication!';
        }

        const clientUrl = this.configService.get('ALLOWED_ORIGIN');

        let htmlTemplate = await this.loadTemplate(template.name);
        htmlTemplate = htmlTemplate.replace('$token', code);
        htmlTemplate = htmlTemplate.replace('$clientUrl', clientUrl);

        await this.mailerService.sendMail({
            to: email,
            subject: template.subject,
            html: htmlTemplate,
        });
    }

    private async loadTemplate(templateName: string): Promise<string> {
        const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
        return fs.promises.readFile(templatePath, 'utf8');
    }
}
