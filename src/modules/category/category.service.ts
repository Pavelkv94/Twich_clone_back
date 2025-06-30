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

        if (total === 0) {
            return [];
        }

        // Generate random indices
        const randomIndices = new Set<number>();
        while (randomIndices.size < count) {
            randomIndices.add(Math.floor(Math.random() * total));
        }

        // Convert to array and sort for efficient querying
        const sortedIndices = Array.from(randomIndices).sort((a, b) => a - b);

        // Fetch all categories and then pick the random ones
        const allCategories = await this.prismaService.category.findMany({
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true,
                    }
                }
            }
        });

        // Map the random indices to actual categories
        return sortedIndices.map(index => allCategories[index]).filter(Boolean);
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
