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

  async findOne(id: number) {
    const result = await this.prisma.rating.findFirst({
      where: { id: id.toString() },
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

  async update(id: number, updateRatingDto: UpdateRatingDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.RATING,
      'id',
      id.toString(),
    );

    const result = await this.prisma.rating.update({
      where: { id: id.toString() },
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

  async remove(id: number) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.RATING,
      'id',
      id.toString(),
    );

    const result = await this.prisma.rating.delete({
      where: { id: id.toString() },
    });

    return {
      message: `This action removes a #${id} rating`,
      data: result,
    };
  }
}
