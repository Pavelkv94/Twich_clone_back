import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { BcryptService } from '../../../shared/bcrypt.service';

@Injectable()
export class AccountService {
    constructor(private readonly prismaService: PrismaService, private readonly bcryptService: BcryptService) { }

    async findAll() {
        const users = await this.prismaService.user.findMany();


        return users;
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
            },
        });

        return user;
    }

}
