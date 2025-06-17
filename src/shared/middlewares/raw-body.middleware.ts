import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import getRawBody from "raw-body";


@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.readable) {
            return next(new BadRequestException('Invalid request'));
        }
        getRawBody(req, { encoding: 'utf-8' }).then((rawBody) => {
            req.body = rawBody;
            next();
        }).catch((err) => {
            next(new BadRequestException('Invalid request'));
        });
    }
}