import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateNewUserDto } from './dto/create-new-user.dto';
import { UserRoles } from 'src/common/types/user.types';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async createNewUser(createNewUserDto: CreateNewUserDto) {
    const { email, password, fullName, role = UserRoles.STUDENT, image } = createNewUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException(`Bu email allaqachon ro'yxatdan o'tgan (${email})`);
    }

    const hashedPassword = await bcrypt.hashSync(
      password,
      parseInt(this.config.get<string>('BCRYPT_SALT_ROUNDS') || '10'),
    );

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
        image: image || null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    return {
      message: 'Yangi foydalanuvchi muvaffaqiyatli yaratildi',
      data: newUser,
    };
  }

  async create(createAdminDto: CreateAdminDto) {
    const { userId, role } = createAdminDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${userId})`);
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: role,
      },
      select: {
        id: true,
        fullName: true,
        role: true,
        image: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      where: {
        role: {
          in: [UserRoles.ADMIN, UserRoles.MENTOR, UserRoles.ASSISTANT],
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (
      !user ||
      ![UserRoles.ADMIN, UserRoles.MENTOR, UserRoles.ASSISTANT].includes(
        user.role as UserRoles,
      )
    ) {
      throw new NotFoundException(`Admin yoki mentor topilmadi (id: ${id})`);
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi (id: ${id})`);
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        role: UserRoles.STUDENT, // yoki default role
      },
    });
  }
}
