import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  checkExistsResurs,
} from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      createRatingDto.userId,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'id',
      createRatingDto.courseId,
    );

    const result = await this.prisma.rating.create({
      data: createRatingDto,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        courses: { select: { id: true, name: true } },
      },
    });

    return {
      message: 'This action adds a new rating',
      data: result,
    };
  }

  async findAll() {
    const result = await this.prisma.rating.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        courses: { select: { id: true, name: true } },
      },
    });

    return {
      message: `This action returns all rating`,
      data: result,
    };
  }

  async findOne(id: string) {
    const result = await this.prisma.rating.findFirst({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        courses: { select: { id: true, name: true } },
      },
    });

    if (!result) {
      throw new NotFoundException(`Rating topilmadi (id: ${id})`);
    }

    return {
      message: `This action returns a #${id} rating`,
      data: result,
    };
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.RATING,
      'id',
      id,
    );

    const result = await this.prisma.rating.update({
      where: { id },
      data: updateRatingDto,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        courses: { select: { id: true, name: true } },
      },
    });

    return {
      message: `This action updates a #${id} rating`,
      data: result,
    };
  }

  async remove(id: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.RATING,
      'id',
      id,
    );

    const result = await this.prisma.rating.delete({
      where: { id },
    });

    return {
      message: `This action removes a #${id} rating`,
      data: result,
    };
  }
}
