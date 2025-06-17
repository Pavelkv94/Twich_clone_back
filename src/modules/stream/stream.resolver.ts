import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { StreamModel } from './models/stream.model';
import { FiltersInput } from './inputs/filters.input';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { User } from '@/prisma/generated';
import { TokenModel } from './models/token.model';
import { StreamTokenInput } from './inputs/stream-token.input';

@Resolver('Stream')
export class StreamResolver {
  constructor(private readonly streamService: StreamService) { }

  @Query(() => [StreamModel], { name: 'findAllStreams' })
  async findAllStreams(@Args('filters', { nullable: true }) filters: FiltersInput) {
    return this.streamService.findAll(filters);
  }

  @Query(() => [StreamModel], { name: 'findRandomStreams' })
  async findRandomStreams() {
    return this.streamService.findRandomStreams();
  }

  @Mutation(() => Boolean, { name: 'changeStreamInfo' })
  @UseGuards(GqlAuthGuard)
  async changeStreamInfo(@Args('input') input: ChangeStreamInfoInput, @ExtractUserFromRequest() user: User) {
    return this.streamService.changeStreamInfo(user, input);
  }

  // @Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
  // @UseGuards(GqlAuthGuard)
  // async changeStreamThumbnail(@Args('file', { type: () => GraphQLUpload, FileValidationPipe }) file: Upload, @ExtractUserFromRequest() user: User) {
  //   return this.streamService.changeThumbnail(user, file);
  // }

  @Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
  @UseGuards(GqlAuthGuard)
  async removeStreamThumbnail(@ExtractUserFromRequest() user: User) {
    return this.streamService.removeThumbnail(user);
  }

  @Mutation(() => TokenModel, { name: 'generateStreamToken' })
  async generateStreamToken(@Args('input') input: StreamTokenInput) {
    return this.streamService.generateStreamToken(input);
  }
}
