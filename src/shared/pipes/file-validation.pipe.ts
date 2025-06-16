import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validateFileFormat, validateFileSize } from "../utils/file.util";
import { ReadStream } from "fs";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { filename, mimetype, createReadStream } = value;
        if (!filename) {
            throw new BadRequestException('File is not valid');
        }

        const fileStream = createReadStream() as ReadStream;

        const allowedFormats = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

        const extension = validateFileFormat(filename, allowedFormats);
        if (!extension) {
            throw new BadRequestException('File is not valid');
        }

        await validateFileSize(fileStream, 1024 * 1024 * 10);

        if (!value.mimetype) {
            throw new BadRequestException('File mimetype is required');
        }

        return value;
    }
}