import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLastActivityDto } from './dto/create-last_activity.dto';
import { UpdateLastActivityDto } from './dto/update-last_activity.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  checAlreadykExistsResurs,
  checkExistsResurs,
} from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class LastActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLastActivityDto: CreateLastActivityDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      createLastActivityDto.userId,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'id',
      createLastActivityDto.courseId,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LESSON_MODULES,
      'id',
      createLastActivityDto.lessonModulId,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LESSONS,
      'id',
      createLastActivityDto.lessonId,
    );

    const result = await this.prisma.lastActivity.create({
      data: createLastActivityDto,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        courses: { select: { id: true, name: true } },
        lessonModule: { select: { id: true, name: true } },
        lesson: { select: { id: true, name: true } },
      },
    });

    return {
      message: 'This action adds a new lastActivity',
      data: result,
    };
  }

  async findAll() {
    const result = await this.prisma.lastActivity.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        courses: { select: { id: true, name: true } },
        lessonModule: { select: { id: true, name: true } },
        lesson: { select: { id: true, name: true } },
      },
    });

    return {
      message: `This action returns all lastActivity`,
      data: result,
    };
  }

  async findOne(id: string) {
    const result = await this.prisma.lastActivity.findFirst({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        courses: { select: { id: true, name: true } },
        lessonModule: { select: { id: true, name: true } },
        lesson: { select: { id: true, name: true } },
      },
    });

    if (!result) {
      throw new NotFoundException(`LastActivity topilmadi (id: ${id})`);
    }

    return {
      message: `This action returns a #${id} lastActivity`,
      data: result,
    };
  }

  async update(id: string, updateLastActivityDto: UpdateLastActivityDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LAST_ACTIVITY,
      'id',
      id,
    );

    const result = await this.prisma.lastActivity.update({
      where: { id },
      data: updateLastActivityDto,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        courses: { select: { id: true, name: true } },
        lessonModule: { select: { id: true, name: true } },
        lesson: { select: { id: true, name: true } },
      },
    });

    return {
      message: `This action updates a #${id} lastActivity`,
      data: result,
    };
  }

  async remove(id: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LAST_ACTIVITY,
      'id',
      id,
    );

    const result = await this.prisma.lastActivity.delete({
      where: { id },
    });

    return {
      message: `This action removes a #${id} lastActivity`,
      data: result,
    };
  }
}
