import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BcryptService } from '@/src/shared/bcrypt.service';
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './inputs/login.input';

@Injectable()
export class SessionService {
    constructor(private readonly prismaService: PrismaService, private readonly bcryptService: BcryptService) { }

    async login(input: LoginInput): Promise<{ userId: string, createdAt: Date | string }> {
        const { login, password } = input;

        const user = await this.prismaService.user.findFirst({ where: { OR: [{ email: login }, { username: login }] } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await this.bcryptService.checkPassword(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return {
            userId: user.id,
            createdAt: new Date(),
        };
    }

    // async logout() {
    //     return new Promise((resolve, reject) => {
    //         req.session.destroy((err) => {
    //             if (err) {
    //                 return reject(new InternalServerErrorException('Failed to destroy session'));
    //             }
    //             req.res.clearCookie(this.configEnvService.sessionName);
    //             return resolve(true);
    //         });
    //     });
    // }
}
