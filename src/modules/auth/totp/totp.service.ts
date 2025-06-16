import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { encode } from 'hi-base32';
import { TOTP } from 'otpauth';
import * as QRCode from 'qrcode';
import { EnableTotpInput } from './inputs/enable-totp.input';
import { TotpModel } from './models/totp.model';

@Injectable()
export class TotpService {

    constructor(private readonly prismaService: PrismaService) { }

    async generateTotpSecret(user: User): Promise<TotpModel> {
        const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 24).toString();

        const totp = new TOTP({
            issuer: 'Epic Stream',
            label: user.email,
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: secret,
        })

        const otpauthUrl = totp.toString();

        const qrCode = await QRCode.toDataURL(otpauthUrl);

        return {
            secret,
            qrCode,
        }
    }

    async enableTotp(user: User, input: EnableTotpInput): Promise<boolean> {
        const { secret, pin } = input;

        const isValidTotp = await this.validateTotp(user, secret, pin);

        if (!isValidTotp) {
            throw new BadRequestException('Invalid TOTP code');
        }

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { isTotpEnabled: true, totpSecret: secret },
        })

        return true;
    }

    async disableTotp(user: User): Promise<boolean> {
        await this.prismaService.user.update({
            where: { id: user.id },
            data: { isTotpEnabled: false, totpSecret: null },
        })

        return true;
    }

    async validateTotp(user: User, secret: string, pin: string): Promise<boolean> {
        const totp = new TOTP({
            issuer: 'Epic Stream',
            label: user.email,
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: secret,
        })

        const isValid = totp.validate({ token: pin });

        if (!isValid) {
            return false;
        }

        return true;
    }
}
