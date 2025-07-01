import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { BcryptService } from '@/src/shared/bcrypt.service';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { UserModel } from '../account/models/user.model';
import { Session } from 'express-session';
import { RedisService } from '@/src/core/modules/redis/redis.service';
import { SessionConfig } from './session.config';
import { TotpService } from '../totp/totp.service';

@Injectable()
export class SessionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly bcryptService: BcryptService,
        private readonly redisService: RedisService,
        private readonly sessionConfig: SessionConfig,
        private readonly totpService: TotpService,
    ) { }

    async findByUserId(userId: any): Promise<any[]> {
        // TODO: replace to sessions:userId:* in redis
        const keys = await this.redisService.keys(`*`);

        const userSessions: any = [];

        for (const key of keys || []) {
            const sessionData = await this.redisService.get(key);
            if (sessionData) {
                const session = JSON.parse(sessionData);
                if (session.userId === userId) {
                    userSessions.push({ ...session, id: key.split(':')[1] });
                }
            }
        }
        userSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return userSessions.filter(session => session.id !== userId);
    }
    async findCurrentSession(sessionKey: string): Promise<any> {
        const currentSession = await this.redisService.get(sessionKey);
        const sessionData: any = JSON.parse(currentSession || '{}');
        return { ...sessionData, id: sessionKey.split(':')[1] };
    }

    async login(input: LoginInput): Promise<UserModel> {
        const { login, password, totpPin } = input;

        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { email: login },
                    { username: login }
                ]
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await this.bcryptService.checkPassword(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        if (!user.isEmailVerified) {
            throw new BadRequestException('Email not verified');
        }

        if (user.isTotpEnabled) {
            if (!totpPin) {
                throw new BadRequestException('TOTP code is required');
            }

            const isValidTotp = await this.totpService.validateTotp(user, user.totpSecret!, totpPin);

            if (!isValidTotp) {
                throw new BadRequestException('Invalid TOTP code');
            }

        }

        return user
    }

    async logout(session: Session) {
        await this.destroySession(session);
    }

    async removeSessionById(id: string, userId: string): Promise<void> {
        const sessionKey = `${this.sessionConfig.sessionPrefix}${id}`;
        const session = await this.redisService.get(sessionKey);
        const sessionData: any = JSON.parse(session || '{}');
        if (sessionData.userId !== userId) {
            throw new UnauthorizedException('You are not authorized to remove this session');
        }
        await this.redisService.del(sessionKey);
    }

    async saveSession(session: any, metadata: any, userId: string): Promise<void> {
        session.userId = userId;
        session.createdAt = new Date();
        session.metadata = metadata;

        await new Promise<void>((resolve, reject) => {
            session.save((err) => {
                if (err) {
                    return reject(new InternalServerErrorException('Failed to save session'));
                }
                resolve();
            });
        });
    }

    async destroySession(session: Session): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            session.destroy((err) => {
                if (err) {
                    return reject(new InternalServerErrorException('Failed to destroy session'));
                }
                resolve();
            });
        });
    }
}
