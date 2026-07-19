import { HttpException, Injectable } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course_category.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  checAlreadykExistsResurs,
  checkExistsResurs,
} from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class CourseCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseCategoryDto) {
    await checAlreadykExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.COURSE_CATEGORIES,
      'name',
      data.name,
    );
    try {
      return {
        message: 'This action adds a new courseCategory',
        data: await this.prisma.courseCategory.create({
          data: { ...data },
        }),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Kategory created filed', 500);
    }
  }

  async findAll() {
    try {
      return {
        message: `This action returns all courseCategories`,
        data: await this.prisma.courseCategory.findMany(),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Find All Ctegories filed ', 500);
    }
  }

  async findOne(id: string) {
    return {
      message: `This action returns a #${id} courseCategory`,
      data: await checkExistsResurs(
        this.prisma,
        ModelsEnumInPrisma.COURSE_CATEGORIES,
        'id',
        id,
      ),
    };
  }

  async update(id: string, data: CreateCourseCategoryDto) {
    await checAlreadykExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.COURSE_CATEGORIES,
      'name',
      data.name,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.COURSE_CATEGORIES,
      'id',
      id,
    );
    try {
      return {
        message: `This action updates a #${id} courseCategory`,
        data: await this.prisma.courseCategory.update({
          where: { id: id },
          data: data,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Course Category updated filed ', 500);
    }
  }

  async remove(id: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.COURSE_CATEGORIES,
      'id',
      id,
    );
    try {
      return {
        message: `This action removes a #${id} courseCategory`,
        data: await this.prisma.courseCategory.delete({ where: { id: id } }),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Course Category delete filed ', 500);
    }
  }
}
