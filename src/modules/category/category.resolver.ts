import { Args, Query, Resolver } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import { CategoryModel } from "./models/category.model";

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) { }


  @Query(() => [CategoryModel], { name: 'findAllCategories' })
  async findAllCategories() {
    return this.categoryService.findAll();
  }

  @Query(() => CategoryModel, { name: 'findCategoryBySlug' })
  async findCategoryBySlug(@Args('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Query(() => [CategoryModel], { name: 'findRandomCategories' })
  async findRandomCategories() {
    return this.categoryService.findRandomCategories();
  }
}