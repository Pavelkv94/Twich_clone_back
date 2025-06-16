import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { User } from '@/prisma/generated/client';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { ChangeProfileInput } from './inputs/change-profile.input';
import { SocialLinkInput, SocialLinkOrderInput } from './inputs/social-link.input';
import { SocialLinkModel } from './models/social-link.model';

@Resolver('Profile')
@UseGuards(GqlAuthGuard)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) { }

  // TODO: Add avatar upload using REST API
  // @Mutation(() => Boolean)
  // async changeAvatar(@Args('file', { type: () => GraphQLUpload }, FileValidationPipe) file: Upload, @ExtractUserFromRequest() user: User) {
  //   return this.profileService.changeAvatar(user, file);
  // }

  @Mutation(() => Boolean, { name: 'changeProfile' })
  async changeProfile(@Args('input') input: ChangeProfileInput, @ExtractUserFromRequest() user: User) {
    return this.profileService.changeProfile(user, input);
  }

  @Query(() => [SocialLinkModel], { name: 'socialLinks' })
  async socialLinks(@ExtractUserFromRequest() user: User): Promise<SocialLinkModel[]> {
    return this.profileService.findSocialLinks(user);
  }


  @Mutation(() => Boolean, { name: 'createSocialLink' })
  async createSocialLink(@Args('input') input: SocialLinkInput, @ExtractUserFromRequest() user: User) {
    return this.profileService.createSocialLink(user, input);
  }

  @Mutation(() => Boolean, { name: 'reorderSocialLinks' })
  async reorderSocialLinks(@Args('list', { type: () => [SocialLinkOrderInput] }) list: SocialLinkOrderInput[]) {
    return this.profileService.reorderSocialLinks(list);
  }

  @Mutation(() => Boolean, { name: 'updateSocialLink' })
  async updateSocialLink(@Args('input') input: SocialLinkInput, @ExtractUserFromRequest() user: User) {
    return this.profileService.updateSocialLink(user.id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteSocialLink' })
  async deleteSocialLink(@Args('id') id: string) {
    return this.profileService.deleteSocialLink(id);
  }
}
