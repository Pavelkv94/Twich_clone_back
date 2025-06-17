import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { ChatMessageModel } from './models/chat-message.model';
import { SendMessageInput } from './inputs/send-message.input';
import { ChatSettingsInput } from './inputs/caht-settings.input';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { User } from '@/prisma/generated/client';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';

@Resolver('Chat')
export class ChatResolver {
  private readonly pubSub: PubSub;

  constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub();
  }

  @Query(() => [ChatMessageModel], { name: 'findMessagesByStreamId' })
  async findMessagesByStreamId(@Args('streamId') streamId: string) {
    return this.chatService.findMessagesByStreamId(streamId);
  }

  @Mutation(() => ChatMessageModel, { name: 'sendMessage' })
  @UseGuards(GqlAuthGuard)
  async sendMessage(@Args('input') input: SendMessageInput, @ExtractUserFromRequest() user: User) {
    const message = await this.chatService.sendMessage(user.id, input);
    this.pubSub.publish(`CHAT_MESSAGE_ADDED:${input.streamId}`, { chatMessageAdded: message });
    return message;
  }

  @Mutation(() => Boolean, { name: 'updateChatSettings' })
  @UseGuards(GqlAuthGuard)
  async updateChatSettings(@Args('input') input: ChatSettingsInput, @ExtractUserFromRequest() user: User) {
    return this.chatService.updateChatSettings(user, input);
  }

  @Subscription(() => ChatMessageModel, { name: 'chatMessageAdded', filter: (payload, variables) => payload.chatMessageAdded.streamId === variables.streamId })
  chatMessageAdded(@Args('streamId') streamId: string) {
    return this.pubSub.asyncIterableIterator(`CHAT_MESSAGE_ADDED:${streamId}`);
  }
}
