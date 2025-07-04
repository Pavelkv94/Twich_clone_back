import { SessionMetadata } from "../types/session-metadata.types";
import { Request } from "express";
import { IS_DEV_ENV } from "./is-dev.util";
import DeviceDetector = require('device-detector-js');
import { lookup } from "geoip-lite";
import countries from 'i18n-iso-countries';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));


export function getSessionMetadata(req: Request, userAgent: string): SessionMetadata {
    const devIp = "127.0.0.1";
    const ip = IS_DEV_ENV ? devIp : Array.isArray(req.headers['cf-connecting-ip'])
        ? req.headers['cf-connecting-ip'][0]
        : req.headers['cf-connecting-ip'] || (typeof req.headers['x-forwarded-for'] === 'string'
            ? req.headers['x-forwarded-for'].split(',')[0]
            : req.ip || devIp)

    const location = lookup(ip);

    const device = new DeviceDetector().parse(userAgent);

    return {
        location: {
            country: countries.getName(location?.country || 'Unknown', 'en') || 'Unknown',
            city: location?.city || 'Unknown',
            latitude: location?.ll[0] || 0,
            longitude: location?.ll[1] || 0,
        },
        device: {
            browser: device?.client?.name || 'Unknown',
            os: device?.os?.name || 'Unknown',
            type: device?.device?.type || 'Unknown',
            ip,
            userAgent,
        },
        ip
    }
}