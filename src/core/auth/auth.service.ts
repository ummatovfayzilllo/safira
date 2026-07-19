import { BadRequestException, Injectable } from '@nestjs/common';
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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly userService: UsersService,
    private readonly emilService: EmailService,
    private readonly jwtService: JwtSubService,
    private readonly prisma : PrismaService,
  ) { }

  async create(data: CreateAuthDto) {
   
    await checAlreadykExistsResurs(this.prisma,ModelsEnumInPrisma.USERS,"email",data.email)
   
    const code = Math.floor(100000 + Math.random() * 900000);
    const ttl = Date.now() + (1000 * (60 * 5))
    const emailresult = await this.emilService.sendResedPasswordVerify(data.email,code,EmailCodeEnum.REGISTER)
   
    this.cacheService.set(data.email, {
      fullname: data.fullName,
      email: data.email,
      password: data.password,
      code
    }, (1000 * (60 * 5)))
   
    return {
      message: 'This action adds a new auth',
      data: { ...data, code, time: (ttl - (Date.now())) / (1000 * 60) }
    };
  }
  
  async verifyCodeRegister(data: VerifyDto) {
    console.log(data.email)
    const olduser = this.cacheService.get(data.email)
    if (!olduser) {
      throw new BadRequestException(`${data.email} emailidagi ma'lumotlar toilmadi !`)
    }
    if (olduser.code !== data.code) {
      throw new BadRequestException("Sizning codeingiz xato kiritildi!")
    }
    this.cacheService.delete(data.email)
    const newUser = await this.userService.create({
      email: olduser.email,
      fullName: olduser.fullname,
      password: olduser.password
    })
    return {
      accessToken: await this.jwtService.getAccessToken(newUser.data),
      refreshToken: await this.jwtService.getRefreshToken(newUser.data)
    }
  }

  async login(data: LoginDto) {
    const oldUser = await this.userService.findByEmail(data.email)
    const decodePass = await this.userService.decodePass(data.password, oldUser.password)
    if (decodePass) {
      return {
        accessToken: await this.jwtService.getAccessToken(oldUser),
        refreshToken: await this.jwtService.getRefreshToken(oldUser)
      }
    }else {
      throw new BadRequestException("Invalid email or password !")
    }
  }
}
