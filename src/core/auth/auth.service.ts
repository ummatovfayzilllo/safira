import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { CreateAuthDto, VerifyDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { CacheService } from './cache.service';
import { UsersService } from 'src/modules/users/users.service';
import { EmailService } from '../email/email.service';
import { EmailCodeEnum } from 'src/common/types/enum.types';
import { JwtSubService } from '../jwt/jwt.service';
import { checAlreadykExistsResurs } from 'src/common/utils/check.functions';
import { PrismaService } from '../prisma/prisma.service';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class AuthService {
  private emailSecret: string;
  private otpTtl: number = 1000 * (60 * 5); // 5 minutes

  constructor(
    private readonly cacheService: CacheService,
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtSubService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.emailSecret =
      this.config.get('EMAIL_SECRET') || 'default-secret-change-this';
  }

  private generateOtpCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private verifyOtpSignature(
    email: string,
    code: number,
    signature: string,
  ): boolean {
    const expectedSignature = createHmac('sha256', this.emailSecret)
      .update(`${email}:${code}`)
      .digest('hex');
    return signature === expectedSignature;
  }

  private generateOtpSignature(email: string, code: number): string {
    return createHmac('sha256', this.emailSecret)
      .update(`${email}:${code}`)
      .digest('hex');
  }

  async create(data: CreateAuthDto) {
    await checAlreadykExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'email',
      data.email,
    );

    const code = this.generateOtpCode();
    const signature = this.generateOtpSignature(data.email, code);
    const ttl = Date.now() + this.otpTtl;

    await this.emailService.sendResedPasswordVerify(
      data.email,
      code,
      EmailCodeEnum.REGISTER,
    );

    this.cacheService.set(
      data.email,
      {
        fullname: data.fullName,
        email: data.email,
        password: data.password,
        code,
        signature,
      },
      this.otpTtl,
    );

    return {
      message: 'Tasdiq kodi emailingizga yuborildi',
      data: {
        email: data.email,
        expiresIn: Math.floor((ttl - Date.now()) / (1000 * 60)),
      },
    };
  }

  async verifyCodeRegister(data: VerifyDto) {
    const cachedUser = this.cacheService.get(data.email);

    if (!cachedUser) {
      throw new BadRequestException(
        `${data.email} uchun tasdiq ma'lumotlari topilmadi!`,
      );
    }

    if (cachedUser.code !== data.code) {
      throw new UnauthorizedException("Tasdiq kodi noto'g'ri!");
    }

    if (!this.verifyOtpSignature(data.email, data.code, cachedUser.signature)) {
      throw new UnauthorizedException('Tasdiq kodi ishonchsiz!');
    }

    this.cacheService.delete(data.email);

    const newUser = await this.userService.create({
      email: cachedUser.email,
      fullName: cachedUser.fullname,
      password: cachedUser.password,
    });

    return {
      accessToken: await this.jwtService.getAccessToken(newUser.data),
      refreshToken: await this.jwtService.getRefreshToken(newUser.data),
    };
  }

  async login(data: LoginDto) {
    const oldUser = await this.userService.findByEmail(data.email);

    if (!oldUser) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri!");
    }

    const decodePass = await this.userService.decodePass(
      data.password,
      oldUser.password,
    );

    if (decodePass) {
      return {
        accessToken: await this.jwtService.getAccessToken(oldUser),
        refreshToken: await this.jwtService.getRefreshToken(oldUser),
      };
    } else {
      throw new UnauthorizedException("Email yoki parol noto'g'ri!");
    }
  }
}
