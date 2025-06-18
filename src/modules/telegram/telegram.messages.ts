import { User } from "@/prisma/generated/client";

export const TELEGRAM_MESSAGES = {
    start: 'Welcome to the bot!',
    me: 'Your profile',
    invalidToken: 'Invalid token!',
    tokenExpired: 'Token expired!',
    telegramConnected: 'Telegram connected successfully!',
    telegramNotConnected: 'You are not connected to Telegram!',
    welcome: 'Welcome to the bot!',
    follows: (user: User) => `Follows: ${user.email}`,
    profile: (user: User) => `Profile: ${user.email}`,
    resetPassword: (token: string) => `Reset password token: ${token}`,
    deactivateToken: (token: string) => `Deactivate token: ${token}`,
    accountDeleted: "Your account has been deleted successfully!",
    streamStart: (channel: User) => `Stream started by ${channel.email}`,
    newFollower: (follower: User) => `New follower: ${follower.email}`,
}