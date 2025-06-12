import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { LoginInput } from './inputs/login.input';
import { InternalServerErrorException } from '@nestjs/common';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { CoreEnvConfig } from '@/src/core/config/core-env.config';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService, private readonly configEnvService: CoreEnvConfig) { }

  @Mutation(() => String)
  async login(@Args('input') input: LoginInput, @Context() context: GqlContext) {
    try {
      const session = await this.sessionService.login(input);

      context.req.session.userId = session.userId;
      context.req.session.createdAt = session.createdAt;

      await new Promise<void>((resolve, reject) => {
        context.req.session.save((err) => {
          if (err) {
            return reject(new InternalServerErrorException('Failed to save session'));
          }
          resolve();
        });
      });

      return `User ${session.userId} logged in successfully.`;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'An error occurred during login');
    }
  }

  @Mutation(() => String, { name: 'logout' })
  async logout(@Context() ctx: GqlContext) {
    try {
      await new Promise<void>((resolve, reject) => {
        ctx.req.session.destroy((err) => {
          if (err) {
            return reject(new InternalServerErrorException('Failed to destroy session'));
          }
          resolve();
        });
      });

      ctx.res.clearCookie(this.configEnvService.sessionName);

      return 'User logged out successfully.';
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'An error occurred during logout');
    }
  }
}