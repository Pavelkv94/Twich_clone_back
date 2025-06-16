import { ReadStream } from "fs";

export function validateFileFormat(filename: string, allowedFormats: string[]) {
    const fileparts = filename.split('.');
    const extension = fileparts[fileparts.length - 1];

    if (allowedFormats.includes(extension)) {
        return extension;
    }

    return null;
}

export async function validateFileSize(fileStream: ReadStream, maxSize: number) {
    let fileSizeInBytes = 0;

    fileStream.on('data', (chunk) => {
        fileSizeInBytes += chunk.length;
    });

    fileStream.on('end', () => {
        if (fileSizeInBytes > maxSize) {
            throw new Error('File size exceeds the maximum allowed size');
        }
    });
}