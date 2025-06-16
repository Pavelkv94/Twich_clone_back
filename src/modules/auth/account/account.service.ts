import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { BcryptService } from '../../../shared/bcrypt.service';
import { VerificationService } from '../verification/verification.service';
import { ChangeEmailInput } from './inputs/change-email.input';
import { User } from '@/prisma/generated/client';
import { ChangePassInput } from './inputs/change-pass.input';

@Injectable()
export class AccountService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly bcryptService: BcryptService,
        private readonly verificationService: VerificationService
    ) { }

    async getMe(id: string) {
        const user = await this.prismaService.user.findUnique({ where: { id }, include: { socialLinks: true } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async create(input: CreateUserInput) {
        const { username, email, password } = input;

        const isEmailExists = await this.prismaService.user.findUnique({ where: { email } });

        if (isEmailExists) {
            throw new Error('User already exists');
        }

        const isUsernameExists = await this.prismaService.user.findUnique({ where: { username } });

        if (isUsernameExists) {
            throw new Error('Username already exists');
        }

        const user = await this.prismaService.user.create({
            data: {
                username,
                email,
                password: await this.bcryptService.generateHash(password),
                displayName: username,
                stream: {
                    create: {
                        title: `Stream of ${username}`,
                    }
                }
            },
        });

        await this.verificationService.sendVerificationEmail(email, user.id);

        return user;
    }

    async changeEmail(input: ChangeEmailInput, user: User) {
        const { email } = input;

        const isEmailExists = await this.prismaService.user.findUnique({ where: { email } });

        if (isEmailExists) {
            throw new Error('Email already exists');
        }

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { email }
        })
        return true;
    }

    async changePass(input: ChangePassInput, user: User) {
        const { password, newPassword } = input;

        const isValidPassword = await this.bcryptService.checkPassword(password, user.password);

        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        const newHashedPassword = await this.bcryptService.generateHash(newPassword);

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { password: newHashedPassword }
        })
        return true;
    }

}
