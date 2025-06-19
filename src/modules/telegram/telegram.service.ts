import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { SponsorshipPlan, TokenType, User } from '@/prisma/generated/client';
import { TELEGRAM_MESSAGES } from './telegram.messages';
import { TELEGRAM_BUTTONS } from './telegram.buttons';

@Update()
@Injectable()
export class TelegramService extends Telegraf {
    private _token: string;
    constructor(private readonly prismaService: PrismaService, private readonly configService: ConfigService) {
        super(configService.get<string>('TELEGRAM_BOT_TOKEN') as string);
        this._token = configService.get<string>('TELEGRAM_BOT_TOKEN') as string;
    }

    @Start()
    async onStart(@Ctx() ctx: any) {
        const username = ctx.message?.from?.username;
        const token = ctx.message?.text?.split(' ')[1];
        if (!username) {
            await ctx.replyWithHTML(TELEGRAM_MESSAGES.welcome);
        }

        if (token) {
            const authToken = await this.prismaService.token.findUnique({
                where: {
                    token: token,
                    type: TokenType.TELEGRAM_AUTH
                }


            });

            if (!authToken) {
                await ctx.reply(TELEGRAM_MESSAGES.invalidToken);
            }

            const hasExpired = authToken && new Date(authToken.expiredAt) < new Date();

            if (hasExpired) {
                await ctx.reply(TELEGRAM_MESSAGES.invalidToken);
            }

            await this.connectTelegram(authToken!.userId, ctx.message.chat.id);
            await this.prismaService.token.delete({
                where: {
                    id: authToken!.id
                }
            });

            await ctx.replyWithHTML(TELEGRAM_MESSAGES.telegramConnected, TELEGRAM_BUTTONS.authSuccess());
        } else {
            const user = await this.findUserByChatId(ctx.message.chat.id.toString());

            const followersCount = await this.prismaService.follow.count({
                where: {
                    followingId: user?.id
                }
            });

            if (user) {
                return await this.onMe(ctx);
            } else {
                await ctx.replyWithHTML(TELEGRAM_MESSAGES.welcome, TELEGRAM_BUTTONS.profile(followersCount));
            }
        }


    }

    @Command('me')
    @Action('me')
    async onMe(@Ctx() ctx: Context) {
        const chatId = ctx.chat?.id.toString();

        const user = await this.findUserByChatId(chatId!);
        const followersCount = await this.prismaService.follow.count({
            where: {
                followingId: user?.id
            }
        });

        if (!user) {
            await ctx.reply(TELEGRAM_MESSAGES.telegramNotConnected);
            return;
        }

        await ctx.replyWithHTML(`User email: ${user.email}`, TELEGRAM_BUTTONS.profile(followersCount));


    }

    @Command('follows')
    @Action('follows')
    async onFollows(@Ctx() ctx: Context) {
        const chatId = ctx.chat?.id.toString();
        const user = await this.findUserByChatId(chatId!);

        if (!user) {
            await ctx.reply(TELEGRAM_MESSAGES.telegramNotConnected);
            return;
        }

        const follows = await this.prismaService.follow.findMany({
            where: {
                followingId: user.id
            },
            include: {
                following: true,
            }
        });

        if (user && follows.length > 0) {
            const followsText = follows.map(follow => `- ${TELEGRAM_MESSAGES.profile(follow.following)}`).join('\n');
            const message = `Follows: ${user.email}\n${followsText}`;
            await ctx.replyWithHTML(message);
        } else {
            await ctx.replyWithHTML('<b>No follows</b>');
        }
    }


    async sendPasswordResetToken(chatId: string, token: string) {
        await this.telegram.sendMessage(chatId, TELEGRAM_MESSAGES.resetPassword(token), { parse_mode: 'HTML' });
    }

    async sendDeactivateToken(chatId: string, token: string) {
        await this.telegram.sendMessage(chatId, TELEGRAM_MESSAGES.deactivateToken(token), { parse_mode: 'HTML' });
    }

    async sendAccountDeletion(chatId: string) {
        await this.telegram.sendMessage(chatId, TELEGRAM_MESSAGES.accountDeleted, { parse_mode: 'HTML' });
    }

    async sendStreamStart(chatId: string, channel: User) {
        await this.telegram.sendMessage(chatId, TELEGRAM_MESSAGES.streamStart(channel), { parse_mode: 'HTML' });
    }

    async sendNewFollower(chatId: string, follower: User) {
        await this.telegram.sendMessage(chatId, TELEGRAM_MESSAGES.newFollower(follower), { parse_mode: 'HTML' });
    }

    async sendNewSponsorship(chatId: string, plan: SponsorshipPlan, sponsor: User) {
        await this.telegram.sendMessage(chatId, TELEGRAM_MESSAGES.newSponsorship(plan, sponsor), { parse_mode: 'HTML' });
    }

    async sendEnableTwoFactor(chatId: string) {
        await this.telegram.sendMessage(chatId, TELEGRAM_MESSAGES.enableTwoFactor, { parse_mode: 'HTML' });
    }

    async sendVerifyChannel(chatId: string) {
        await this.telegram.sendMessage(chatId, TELEGRAM_MESSAGES.verifyChannel, { parse_mode: 'HTML' });
    }

    private async connectTelegram(userId: string, chatId: string) {
        await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                telegramId: chatId
            }
        });
    }

    private async findUserByChatId(chatId: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                telegramId: chatId
            },
            include: {
                followers: true,
                followings: true,
            }
        });

        return user;
    }
}
