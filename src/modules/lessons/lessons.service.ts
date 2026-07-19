import { HttpException, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { urlGenerator } from 'src/common/utils/generators';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class LessonsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async create(data: CreateLessonDto, video?: string | undefined) {
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.LESSONS, "name", data.name)
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSON_MODULES, "id", data.lessonModulId)
    try {
      if (video) {
        data['video'] = urlGenerator(this.config, video)
      }

      return {
        message: 'This action adds a new lesson',
        data: await this.prisma.lesson.create({ data })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Lesson create filed", 500)
    }
  }

  async findAll() {
    try {
      return {
        message: `This action returns all lessons`,
        data: await this.prisma.lesson.findMany()
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Lesson findAll filed", 500)
    }
  }

  async findOne(id: string) {
    return {
      message: `This action returns a #${id} lesson`,
      data: await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSONS, "id", id)
    };
  }

  async update(id: string, data: UpdateLessonDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSONS, "id", id)
    if (data.lessonModulId) await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSON_MODULES, "id", data.lessonModulId)
    if (data.name) await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.LESSONS, "name", data.name)
    try {
      return {
        message: `This action updates a #${id} lesson`,
        data: await this.prisma.lesson.update({
          where: { id: id },
          data: { ...data }
        })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Lesson update filed", 500)
    }
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSONS, "id", id)
    try {
      return {
        message : `This action removes a #${id} lesson`,
        data : await this.prisma.lesson.delete({
          where : {id : id}
        })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Lesson delete filed", 500)
    }
  }
}
