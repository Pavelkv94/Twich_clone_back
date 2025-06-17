import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        const categories = await this.prismaService.category.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true,
                    }
                }
            }
        });

        return categories;
    }

    async findRandomCategories(count: number = 7) {
        const total = await this.prismaService.category.count();

        const randomIndex = new Set<number>();
        while (randomIndex.size < count) {
            randomIndex.add(Math.floor(Math.random() * total));
        }

        const categories = await this.prismaService.category.findMany({
            take: count,
            skip: 0,
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true,
                    }
                }
            }
        });

        return Array.from(randomIndex).map(index => categories[index]);
    }

    async findBySlug(slug: string) {
        const category = await this.prismaService.category.findUnique({
            where: { slug },
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true,
                    }
                },
            }
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }
}
