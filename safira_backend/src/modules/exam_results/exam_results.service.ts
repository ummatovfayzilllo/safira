import { HttpException, Injectable } from '@nestjs/common';
import { CreateExamResultDto } from './dto/create-exam_result.dto';
import { UpdateExamResultDto } from './dto/update-exam_result.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class ExamResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateExamResultDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      data.userId,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LESSON_MODULES,
      'id',
      data.lessonModulId,
    );

    try {
      const result = await this.prisma.examResult.create({ data });
      return {
        message: 'ExamResult successfully created',
        data: result,
      };
    } catch (error) {
      console.error(error.message);
      throw new HttpException('ExamResult create failed!', 500);
    }
  }

  async findAll() {
    try {
      const results = await this.prisma.examResult.findMany();
      return {
        message: 'ExamResults fetched successfully',
        data: results,
      };
    } catch (error) {
      console.error(error.message);
      throw new HttpException('ExamResult findAll failed!', 500);
    }
  }

  async findOne(id: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.EXAM_RESULTS,
      'id',
      id,
    );
    try {
      const result = await this.prisma.examResult.findUnique({ where: { id } });
      return {
        message: `ExamResult with ID ${id} found`,
        data: result,
      };
    } catch (error) {
      console.error(error.message);
      throw new HttpException('ExamResult findOne failed!', 500);
    }
  }

  async update(id: string, data: UpdateExamResultDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.EXAM_RESULTS,
      'id',
      id,
    );
    if (data.userId) {
      await checkExistsResurs(
        this.prisma,
        ModelsEnumInPrisma.USERS,
        'id',
        data.userId,
      );
    }
    if (data.lessonModulId) {
      await checkExistsResurs(
        this.prisma,
        ModelsEnumInPrisma.LESSON_MODULES,
        'id',
        data.lessonModulId,
      );
    }

    try {
      const result = await this.prisma.examResult.update({
        where: { id },
        data,
      });
      return {
        message: `ExamResult with ID ${id} updated successfully`,
        data: result,
      };
    } catch (error) {
      console.error(error.message);
      throw new HttpException('ExamResult update failed!', 500);
    }
  }

  async remove(id: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.EXAM_RESULTS,
      'id',
      id,
    );
    try {
      const result = await this.prisma.examResult.delete({ where: { id } });
      return {
        message: `ExamResult with ID ${id} deleted successfully`,
        data: result,
      };
    } catch (error) {
      console.error(error.message);
      throw new HttpException('ExamResult delete failed!', 500);
    }
  }
}
