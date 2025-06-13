import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { LoginInput } from './inputs/login.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { UserModel } from '../account/models/user.model';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { ExtractUserAgent } from '@/src/shared/decorators/params/extract-user-agent.decorator';
import { SessionModel } from './models/session.model';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { SessionConfig } from './session.config';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService, private readonly sessionConfig: SessionConfig) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => [SessionModel], { name: 'findSessionsByUserId' })
  async findByUserId(@Context() ctx: GqlContext): Promise<SessionModel[]> {
    const userId = ctx.req.session.userId;

    if (!userId) {
      throw new UnauthorizedException('User not found in session');
    }

    return this.sessionService.findByUserId(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => SessionModel, { name: 'findCurrentSession' })
  async findCurrentSession(@Context() ctx: GqlContext): Promise<SessionModel> {
    const sessionKey = `${this.sessionConfig.sessionPrefix}${ctx.req.session.id}`;
    return this.sessionService.findCurrentSession(sessionKey);
  }

  @Mutation(() => UserModel, { name: 'login' })
  async login(@Args('input') input: LoginInput, @Context() ctx: GqlContext, @ExtractUserAgent() userAgent: string) {
    const user = await this.sessionService.login(input);

    const metadata = getSessionMetadata(ctx.req, userAgent);

    await this.sessionService.saveSession(ctx.req.session, metadata, user.id);

    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String, { name: 'logout' })
  async logout(@Context() ctx: GqlContext) {
    await this.sessionService.logout(ctx.req.session);

    ctx.res.clearCookie(this.sessionConfig.sessionName);

    return 'User logged out successfully.';
  }

  @Mutation(() => String, { name: 'clearCookies' })
  async clearCookies(@Context() ctx: GqlContext) {
    await ctx.res.clearCookie(this.sessionConfig.sessionName);
    return 'Session cleared successfully.';
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String, { name: 'removeSessionById' })
  async removeSessionById(@Context() ctx: GqlContext, @Args('id') id: string, @ExtractUserFromRequest('id') userId: string) {
    if (ctx.req.session.id === id) {
      throw new UnauthorizedException('You are not authorized to remove your current session');
    }
    await this.sessionService.removeSessionById(id, userId);

    return 'Session removed successfully.';
  }

}