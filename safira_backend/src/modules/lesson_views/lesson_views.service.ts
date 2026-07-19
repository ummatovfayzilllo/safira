import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonViewDto } from './dto/create-lesson_view.dto';
import { UpdateLessonViewDto } from './dto/update-lesson_view.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  checkExistsResurs,
} from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class LessonViewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLessonViewDto: CreateLessonViewDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      createLessonViewDto.userId,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LESSONS,
      'id',
      createLessonViewDto.lessonId,
    );

    const result = await this.prisma.lessonView.create({
      data: {
        ...createLessonViewDto,
        view: true,
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        lesson: { select: { id: true, name: true } },
      },
    });

    return {
      message: 'This action adds a new lessonView',
      data: result,
    };
  }

  async findAll() {
    const result = await this.prisma.lessonView.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        lesson: { select: { id: true, name: true } },
      },
    });

    return {
      message: `This action returns all lessonViews`,
      data: result,
    };
  }

  async findOne(id: string) {
    const result = await this.prisma.lessonView.findFirst({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        lesson: { select: { id: true, name: true } },
      },
    });

    if (!result) {
      throw new NotFoundException(`LessonView topilmadi (id: ${id})`);
    }

    return {
      message: `This action returns a #${id} lessonView`,
      data: result,
    };
  }

  async update(id: string, updateLessonViewDto: UpdateLessonViewDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LESSON_VIEWS,
      'id',
      id,
    );

    const result = await this.prisma.lessonView.update({
      where: { id },
      data: updateLessonViewDto,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        lesson: { select: { id: true, name: true } },
      },
    });

    return {
      message: `This action updates a #${id} lessonView`,
      data: result,
    };
  }

  async remove(id: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LESSON_VIEWS,
      'id',
      id,
    );

    const result = await this.prisma.lessonView.delete({
      where: { id },
    });

    return {
      message: `This action removes a #${id} lessonView`,
      data: result,
    };
  }
}
