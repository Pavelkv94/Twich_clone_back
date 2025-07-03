import { User } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { StorageService } from '@/src/core/modules/storage/storage.service';
import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ChangeProfileInput } from './inputs/change-profile.input';
import { SocialLinkInput, SocialLinkOrderInput } from './inputs/social-link.input';
import { SocialLinkModel } from './models/social-link.model';

@Injectable()
export class ProfileService {
    constructor(private readonly storageService: StorageService, private readonly prismaService: PrismaService) { }

    async changeAvatar(user: User, file: any) {
        if (user.avatar) {
            await this.storageService.deleteFile(user.avatar);
        }

        const chunks: Buffer[] = [];
        for await (const chunk of file.createReadStream()) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        const filename = `channels/${user.username}.webp`;

        if (file.filename && file.mimetype.endsWith('gif')) {
            const image = await sharp(buffer, { animated: true }).resize(512, 512).webp().toBuffer();
            await this.storageService.uploadFile(image, filename, 'image/webp');
        } else {
            const image = await sharp(buffer, { animated: true }).resize(512, 512).webp().toBuffer();
            await this.storageService.uploadFile(image, filename, 'image/webp');
        }

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { avatar: filename },
        });

        return true;
    }

    async removeAvatar(user: User) {
        if (!user.avatar) {
            return false;
        }

        await this.storageService.deleteFile(user.avatar);

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { avatar: null },
        });

        return true;
    }

    async changeProfile(user: User, input: ChangeProfileInput) {
        const { username, displayName, bio } = input;

        const usernameExists = await this.prismaService.user.findUnique({
            where: { username },
        });

        if (usernameExists && username !== user.username) {
            throw new Error('Username already used');
        }

        await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                username,
                displayName,
                bio,
            },
        });

        return true;
    }

    async createSocialLink(user: User, input: SocialLinkInput) {
        const { title, url } = input;

        const lastSocialLink = await this.prismaService.socialLink.findFirst({
            where: { userId: user.id },
            orderBy: { position: 'desc' },
        });

        const position = lastSocialLink ? lastSocialLink.position + 1 : 1;

        await this.prismaService.socialLink.create({
            data: { title, url, position, user: { connect: { id: user.id } } },
        });

        return true;
    }

    async findSocialLinks(user: User): Promise<SocialLinkModel[]> {
        const socialLinks = await this.prismaService.socialLink.findMany({
            where: { userId: user.id },
            orderBy: { position: 'asc' },
        });

        return socialLinks;
    }

    async reorderSocialLinks(inputList: SocialLinkOrderInput[]) {
        if (!inputList || inputList.length === 0) {
            return false;
        }

        const updatedPromises = inputList.map(async (input) => {
            await this.prismaService.socialLink.update({
                where: { id: input.id },
                data: { position: input.position },
            });
        });

        await Promise.all(updatedPromises);

        return true;
    }

    async updateSocialLink(id: string, input: SocialLinkInput) {
        const { title, url } = input;

        await this.prismaService.socialLink.update({
            where: { id },
            data: { title, url },
        });

        return true;
    }

    async deleteSocialLink(id: string) {
        await this.prismaService.socialLink.delete({
            where: { id },
        });

        return true;
    }
}
