import { HttpException, Injectable } from '@nestjs/common';
import { CreateLessonModuleDto } from './dto/create-lesson_module.dto';
import { UpdateLessonModuleDto } from './dto/update-lesson_module.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class LessonModulesService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(data: CreateLessonModuleDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.COURSES, "id", data.courseId)
    try {
      return {
        message: "This action create leson-modeules successfuly",
        data: await this.prisma.lessonModul.create({ data: data })
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("LessonModule create filed !", 500)
    }
  }

  async findAll() {
    try {
      return {
        message : `This action returns all lessonModules`,
        data : await this.prisma.lessonModul.findMany()
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("LessonModule findAll filed !", 500)
    }
  }

  async findOne(id: string) {
    return {
      message: `This action returns a #${id} lessonModule`,
      data: await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSON_MODULES, "id", id)
    };
  }

  async update(id: string, data: UpdateLessonModuleDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSON_MODULES, "id", id)
    try {
      if (data.courseId) await checkExistsResurs(this.prisma, ModelsEnumInPrisma.COURSES, "id", data.courseId)
      return {
        message: `This action updates a #${id} lessonModule`,
        data: await this.prisma.assignedCourse.update({
          where:
          {
            id: id
          },
          data: data
        })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("LessonModule update filed !", 500)
    }
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSON_MODULES, "id", id)
    try {
      return {
        message: `This action removes a #${id} lessonModule`,
        data: await this.prisma.assignedCourse.delete({
          where:
          {
            id: id
          }
        })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("LessonModule delete filed !", 500)
    }
  }
}
