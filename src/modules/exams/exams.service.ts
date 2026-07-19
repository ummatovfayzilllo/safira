import { HttpException, Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class ExamsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(data: CreateExamDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSON_MODULES, "id", data.lessonModulId)
    try {
      return {
        message: 'This action adds a new exam',
        data: await this.prisma.exam.create({
          data: data
        })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Exam create filed !", 500)
    }
  }

  async findAll() {
    try {
      return {
        message: `This action returns all exams`,
        data: await this.prisma.exam.findMany()
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Exam find all filed !", 500)
    }
  }

  async findOne(id: string) {
    return {
      message: `This action returns a #${id} exam`,
      data: await checkExistsResurs(this.prisma, ModelsEnumInPrisma.EXAMS, "id", id)
    };
  }

  async update(id: string, data: UpdateExamDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.EXAMS, "id", id)
    if (data.lessonModulId) await checkExistsResurs(this.prisma, ModelsEnumInPrisma.LESSON_MODULES, "id", data.lessonModulId)

    try {
      return {
        message : `This action updates a #${id} exam`,
        data : await this.prisma.exam.update({
          where : {id : id},
          data : data
        })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Exam update filed !", 500)
    }
  }

  async remove(id: string) {
    checkExistsResurs(this.prisma,ModelsEnumInPrisma.EXAMS,"id", id)
    try {
    return {
      message : `This action removes a #${id} exam`,
      data : await this.prisma.exam.delete({
        where : {id : id }
      })
    };
    } catch (error) {
      console.log(error)
      throw new HttpException("Exam delete filed !", 500)
    }
  }
}
