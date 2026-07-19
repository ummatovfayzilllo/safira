import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionAnswerDto } from './dto/create-question_answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question_answer.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  checkExistsResurs,
} from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class QuestionAnswersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuestionAnswerDto: CreateQuestionAnswerDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      createQuestionAnswerDto.userId,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.QUESTIONS,
      'id',
      createQuestionAnswerDto.questionId,
    );

    const result = await this.prisma.questionAnswer.create({
      data: createQuestionAnswerDto,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        question: { select: { id: true, text: true } },
      },
    });

    return {
      message: 'This action adds a new questionAnswer',
      data: result,
    };
  }

  async findAll() {
    const result = await this.prisma.questionAnswer.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        question: { select: { id: true, text: true } },
      },
    });

    return {
      message: `This action returns all questionAnswers`,
      data: result,
    };
  }

  async findOne(id: string) {
    const result = await this.prisma.questionAnswer.findFirst({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        question: { select: { id: true, text: true } },
      },
    });

    if (!result) {
      throw new NotFoundException(`QuestionAnswer topilmadi (id: ${id})`);
    }

    return {
      message: `This action returns a #${id} questionAnswer`,
      data: result,
    };
  }

  async update(id: string, updateQuestionAnswerDto: UpdateQuestionAnswerDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.QUESTION_ANSWERS,
      'id',
      id,
    );

    const result = await this.prisma.questionAnswer.update({
      where: { id },
      data: updateQuestionAnswerDto,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        question: { select: { id: true, text: true } },
      },
    });

    return {
      message: `This action updates a #${id} questionAnswer`,
      data: result,
    };
  }

  async remove(id: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.QUESTION_ANSWERS,
      'id',
      id,
    );

    const result = await this.prisma.questionAnswer.delete({
      where: { id },
    });

    return {
      message: `This action removes a #${id} questionAnswer`,
      data: result,
    };
  }
}
