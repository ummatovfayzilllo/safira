import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, jwtTokenTypeEnum } from 'src/common/config/jwt.secrets';
import { JwtSubService } from 'src/core/jwt/jwt.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/types/auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtSubService: JwtSubService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = await this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) return true;
      const req = context.switchToHttp().getRequest();

      await this.getPayload(req, context);
      return true;
    } catch (error) {
      throw error;
    }
  }
  async getPayload(req: Request, ctx: ExecutionContext) {
    let token: string | undefined;

    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedException('Token not found in header or cookie!');
    }

    try {
      const user: JwtPayload = await this.jwtSubService.verifyToken<JwtPayload>(
        token,
        jwtTokenTypeEnum.ACCESS,
      );
      req['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or expired token!');
    }
  }
}
