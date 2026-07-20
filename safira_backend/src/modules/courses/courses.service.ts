import { HttpException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { urlGenerator } from 'src/common/utils/generators';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  checAlreadykExistsResurs,
  checkExistsResurs,
} from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Course } from '@prisma/client';
import { unlinkFile } from 'src/common/utils/file.helpers';
import { userFindOneEntity } from '../users/entities/user.entity';
@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
  async create(data: CreateCourseDto, banner?: string, introVideo?: string) {
    await checAlreadykExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'name',
      data.name,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.MENTOR_PROFILES,
      'id',
      data.mentorId,
    );
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.COURSE_CATEGORIES,
      'id',
      data.categoryId,
    );
    if (introVideo) {
      data['introVideo'] = introVideo;
    }
    if (banner) {
      data['banner'] = banner;
    }
    let result = {};
    try {
      result = await this.prisma.course.create({ data: { ...data } });
      return {
        message: 'This action adds a new course',
        data: result,
      };
    } catch (error) {}
  }

  async findAll() {
    try {
      const courses = await this.prisma.course.findMany({
        include: {
          mentor: {
            include: { user: { select: userFindOneEntity } },
          },
          category: true,
        },
      });
      const data = courses.map((course) => ({
        ...course,
        banner: course.banner
          ? urlGenerator(this.config, course.banner)
          : course.banner,
        introVideo: course.introVideo
          ? urlGenerator(this.config, course.introVideo)
          : course.introVideo,
      }));
      return {
        message: `This action returns all courses`,
        data,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Courses read filed ', 500);
    }
  }

  async findOne(id: number) {
    const result = await checkExistsResurs<Course>(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'id',
      id,
    );
    return {
      message: `This action returns a #${id} course`,
      data: {
        ...result,
        banner: result.banner
          ? urlGenerator(this.config, result.banner)
          : result.banner,
        introVideo: result.introVideo
          ? urlGenerator(this.config, result.introVideo)
          : result.introVideo,
      },
    };
  }

  async update(
    id: string,
    data: UpdateCourseDto,
    banner?: string,
    introVideo?: string,
  ) {
    const course = await checkExistsResurs<Course>(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'id',
      id,
    );
    try {
      if (banner) {
        if (course.banner) {
          unlinkFile(course.banner);
        }
        data['banner'] = banner;
      }
      if (introVideo) {
        if (course.introVideo) {
          unlinkFile(course.introVideo);
        }
        data['introVideo'] = introVideo;
      }
      return {
        message: `This action updates a #${id} course`,
        data: await this.prisma.course.update({
          where: { id: id },
          data: data,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Course update filed ', 500);
    }
  }

  async remove(id: string) {
    const course = await checkExistsResurs<Course>(
      this.prisma,
      ModelsEnumInPrisma.COURSES,
      'id',
      id,
    );
    if (course.banner) {
      unlinkFile(course.banner);
    }
    if (course.introVideo) {
      unlinkFile(course.introVideo);
    }
    try {
      return {
        message: `This action removes a #${id} course`,
        data: await this.prisma.course.delete({ where: { id: id } }),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Course update filed ', 500);
    }
  }
}
