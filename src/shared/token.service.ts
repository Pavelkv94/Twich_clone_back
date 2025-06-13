import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenType } from "@/prisma/generated";
import { PrismaService } from "@/src/core/modules/prisma/prisma.service";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
    constructor(private readonly prismaService: PrismaService) { }

    async generateToken(userId: string, type: TokenType, isUUID: boolean = false) {
        let token: string;

        if (isUUID) {
            token = uuidv4();
        } else {
            token = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString();
        }

        const expiredAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                type,
                user: {
                    id: userId
                }
            }
        })

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id
                }
            })
        }

        const newToken = await this.prismaService.token.create({
            data: {
                token,
                type,
                expiredAt,
                user: {
                    connect: {
                        id: userId
                    }
                }
            },
            include: {
                user: true
            }
        })

        return newToken;

    }

    async verifyToken(token: string, type: TokenType) {
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token: token,
                type: type
            }
        })

        if (!existingToken) {
            throw new NotFoundException('Token not found');
        }

        const hasExpired = new Date(existingToken.expiredAt) < new Date();
        if (hasExpired) {
            throw new BadRequestException('Token expired');
        }

        return existingToken;
    }
}