import { Controller, Post, Body, Res, HttpStatus, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto, VerifyDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto, AuthResponseDto } from './dto/auth-response.dto';
import { RequestPasswordResetDto, VerifyPasswordResetDto, ResetPasswordResponseDto } from './dto/reset-password.dto';
import { RefreshTokenDto, TokenResponseDto } from './dto/refresh-token.dto';
import { Public } from 'src/global/decorators/auth.decorators';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: "Ro'yxatdan o'tish (tasdiq kodini emailga yuboradi)",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tasdiq kodi emailga yuborildi',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Foydalanuvchi allaqachon mavjud yoki email noto'g'ri",
  })
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Tasdiq kodini tekshirish va tokenlarni olish' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Muvaffaqiyatli tasdiq. Tokenlar cookiega va body ga yuborildi',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Tasdiq kodi noto'g'ri yoki expired",
  })
  async verify(@Body() data: VerifyDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.verifyCodeRegister(data);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(HttpStatus.CREATED).send({ accessToken, refreshToken });
  }

  @Post('login')
  @ApiOperation({ summary: 'Kirish (email va parol)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Muvaffaqiyatli kirish. Tokenlar cookiega va body ga yuborildi',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Email yoki parol noto'g'ri",
  })
  async login(@Body() data: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(data);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(HttpStatus.CREATED).send({ accessToken, refreshToken });
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Parol yangilash - tasdiq kodi yuborish' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tasdiq kodi emailga yuborildi',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Email topilmadi',
  })
  async requestPasswordReset(@Body() data: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(data.email);
  }

  @Post('reset-password/verify')
  @ApiOperation({ summary: 'Parolni yangilash - tasdiq kodi tekshirish' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Parol muvaffaqiyatli yangilandi',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Tasdiq kodi noto'g'ri",
  })
  async verifyPasswordReset(
    @Body() data: VerifyPasswordResetDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.verifyPasswordReset(
      data.email,
      data.code,
      data.newPassword,
    );
    res.status(HttpStatus.CREATED).send(result);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Yangi access token olish (refresh token bilan)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Yangi tokenlar yaratildi',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Refresh token noto'g'ri yoki expired",
  })
  async refreshToken(
    @Body() data: RefreshTokenDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let token = data.refreshToken;

    if (!token) {
      token = req.cookies?.refreshToken;
    }

    if (!token) {
      throw new UnauthorizedException('Refresh token topilmadi!');
    }

    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(token);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(HttpStatus.CREATED).send({ accessToken, refreshToken });
  }
}
