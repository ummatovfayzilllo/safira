import { HttpException, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { urlGenerator } from 'src/common/utils/generators';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Question } from '@prisma/client';
import { unlinkFile } from 'src/common/utils/file.helpers';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private withFileUrl<T extends { file?: string | null }>(record: T): T {
    return {
      ...record,
      file: record.file ? urlGenerator(this.config, record.file) : record.file,
    };
  }

  async create(data: CreateQuestionDto, files: Express.Multer.File[]) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      data.userId,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'id',
      data.courseId,
    );
    if (files && files[0]) {
      data['file'] = files[0].filename;
    }
    try {
      const created = await this.prisma.question.create({ data: data });
      return {
        message: 'This action adds a new question',
        data: this.withFileUrl(created),
      };
    } catch (error) {
      console.log(error.message);
      throw new HttpException('Question create filed !', 500);
    }
  }

  async findAll() {
    try {
      const questions = await this.prisma.question.findMany();
      return {
        message: `This action returns all questions`,
        data: questions.map((question) => this.withFileUrl(question)),
      };
    } catch (error) {
      console.log(error.message);
      throw new HttpException('Questions read filed !', 500);
    }
  }

  async findOne(id: string) {
    const question = await checkExistsResurs<{ file?: string | null }>(
      this.prisma,
      ModelsEnumInPrisma.QUESTIONS,
      'id',
      id,
    );
    return {
      message: `This action returns a #${id} question`,
      data: this.withFileUrl(question),
    };
  }

  async update(
    id: string,
    data: UpdateQuestionDto,
    files?: Express.Multer.File[],
  ) {
    const oldQuestioon = await checkExistsResurs<Question>(
      this.prisma,
      ModelsEnumInPrisma.QUESTIONS,
      'id',
      id,
    );
    try {
      if (files && files[0]) {
        data['file'] = files[0].filename;
      }
      if (oldQuestioon.file) {
        await unlinkFile(oldQuestioon.file);
      }
      const updatedQuestion = await this.prisma.question.update({
        where: { id: id },
        data: data,
      });
      return {
        message: `This action update a #${id} question`,
        data: this.withFileUrl(updatedQuestion),
      };
    } catch (error) {
      console.log(error.message);
      throw new HttpException('Question update filed !', 500);
    }
  }

  async remove(id: string) {
    const oldQuestioon = await checkExistsResurs<Question>(
      this.prisma,
      ModelsEnumInPrisma.QUESTIONS,
      'id',
      id,
    );
    try {
      if (oldQuestioon.file) {
        await unlinkFile(oldQuestioon.file);
      }
      const deletedQuestion = await this.prisma.question.delete({
        where: { id: id },
      });
      return {
        message: `This action removes a #${id} question`,
        data: deletedQuestion,
      };
    } catch (error) {
      console.log(error.message);
      throw new HttpException('Question delete filed !', 500);
    }
  }
}
