import { Markup } from "telegraf"

export const TELEGRAM_BUTTONS = {
    authSuccess: () =>
        Markup.inlineKeyboard([
            Markup.button.callback('Open stream', 'open_stream'),
            Markup.button.callback('My followers', 'my_followers'),
            Markup.button.callback('My followings', 'my_followings'),
        ])
    ,
    profile: (followersCount: number) => Markup.inlineKeyboard([
        Markup.button.callback('Profile', 'me'), //    @Action('me') in telegram.service.ts
        Markup.button.callback('Follows', 'follows'), //    @Action('follows') in telegram.service.ts
        Markup.button.url('Open stream', 'https://stream.com'),
    ])


}