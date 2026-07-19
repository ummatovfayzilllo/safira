import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { urlGenerator } from 'src/common/utils/generators';
import {
  checAlreadykExistsResurs,
  checkExistsResurs,
} from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { userFindOneEntity } from './entities/user.entity';
import { User } from '@prisma/client';
import { unlinkFile } from 'src/common/utils/file.helpers';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(data: CreateUserDto, image?: string) {
    console.log(data, image);
    await checAlreadykExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'email',
      data.email,
    );
    if (image) {
      data['image'] = urlGenerator(this.config, image);
    }
    const hashedPass = await bcrypt.hashSync(
      data.password,
      parseInt(this.config.get<string>('BCRYPT_SALT_ROUNDS') || '10'),
    );
    data.password = hashedPass || data.password;
    console.log(hashedPass);
    const newUser = await this.prisma.user.create({
      data: data,
      select: userFindOneEntity,
    });
    return {
      message: "Siz muoffaqqiyatli ro'yhatdan o'tdingiz",
      data: newUser,
    };
  }

  async updateImage(id: string, imageName: string) {
    const image = urlGenerator(this.config, imageName);
    const oldUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      id,
    );
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: { image: image },
        select: userFindOneEntity,
      });
      if (oldUser.image) {
        if (typeof oldUser.image.split('/').at(-1) === 'string') {
          const filename = oldUser.image.split('/').at(-1);
          unlinkFile(filename || '');
        }
      }
      return {
        data: updatedUser,
        message: 'UserImage update successfully',
      };
    } catch (error) {}
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: userFindOneEntity,
    });
    return {
      message: `This action returns all users`,
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: id },
      select: userFindOneEntity,
    });
    if (!user) {
      throw new NotFoundException('User not found ');
    }
    return {
      message: `This action returns a [ ${id} ] user`,
      data: user,
    };
  }

  async update(id: string, data: UpdateUserDto, image?: string) {
    const oldUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      id,
    );
    if (data.email) {
      await checAlreadykExistsResurs(
        this.prisma,
        ModelsEnumInPrisma.USERS,
        'email',
        data.email,
      );
    }
    if (data.password) {
      const hashedPass = await bcrypt.hashSync(
        data.password,
        parseInt(this.config.get<string>('BCRYPT_SALT_ROUNDS') || '10'),
      );
      data.password = hashedPass;
    }

    if (image) {
      data['image'] = urlGenerator(this.config, image);
      if (oldUser.image) {
        if (typeof oldUser.image.split('/').at(-1) === 'string') {
          const filename = oldUser.image.split('/').at(-1);
          unlinkFile(filename || '');
        }
      }
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: data,
        select: userFindOneEntity,
      });
      return {
        message: `This action updates a #${id} user`,
        updatedUser,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Userning ma'lumotlarini yangilashda hatolik`,
        500,
      );
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    const oldUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      id,
    );
    try {
      const deletedUser = await this.prisma.user.delete({ where: { id: id } });
      if (oldUser.image) {
        if (typeof oldUser.image.split('/').at(-1) === 'string') {
          const filename = oldUser.image.split('/').at(-1);
          unlinkFile(filename || '');
        }
      }
      return {
        message: `This action deleted a #${id} user`,
        deletedUser,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(`Userni o'chirishda hatolik`, 500);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'email',
      email,
    );
  }

  async decodePass(password: string, userPassword: string) {
    console.log(userPassword, password);
    return bcrypt.compareSync(password, userPassword);
  }

  async findById(id: string): Promise<User> {
    return checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      id,
    );
  }

  async updatePassword(email: string, newPassword: string) {
    const user = await this.findByEmail(email);
    const hashedPass = await bcrypt.hashSync(
      newPassword,
      parseInt(this.config.get<string>('BCRYPT_SALT_ROUNDS') || '10'),
    );

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPass },
      select: userFindOneEntity,
    });

    return {
      message: "Parolingiz muvaffaqiyatli o'zgartirildi",
      data: updatedUser,
    };
  }
}
