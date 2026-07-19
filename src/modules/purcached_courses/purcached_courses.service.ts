import { BadRequestException, ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreatePurcachedCourseDto } from './dto/create-purcached_course.dto';
import { UpdatePurcachedCourseDto } from './dto/update-purcached_course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { purcachedCourseFindEntity } from 'src/common/types/payments.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Course } from '@prisma/client';

@Injectable()
export class PurcachedCoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }
  async create(data: CreatePurcachedCourseDto) {
    const course = await checkExistsResurs<Course>(this.prisma, ModelsEnumInPrisma.COURSES, "id", data.courseId)
    if(data.amount  !== course.price)  throw new BadRequestException(`Your amount [${data.amount}] noequel in course price [${course.price}]`)
    if(!course.published) throw new BadRequestException(`[${course.name}] not published `)    
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "id", data.userId)
    const oldPurcached = await this.prisma.purcachedCourse.findMany(purcachedCourseFindEntity(data))

    if (oldPurcached[0]) throw new ConflictException(`PurcachedCourse by userId [${data.userId}] and by courseId [${data.courseId}] already exists !`)
      
    try {
      return {
        message: 'This action adds a new purcachedCourse',
        data: await this.prisma.purcachedCourse.create({ data: { ...data } })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("PurcachedCourse create filed ", 500)
    }
  }

  async findAll() {
    try {
      return {
        message  :`This action returns all purcachedCourses`,
        data : await this.prisma.purcachedCourse.findMany()
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("PurcachedCourse update filed ", 500)
    }
  }

  async findOne(id: string) {
    return {
      message : `This action returns a #${id} purcachedCourse`,
      data : await checkExistsResurs(this.prisma,ModelsEnumInPrisma.PURCACHED_COURSES,"id",id)
    };
  }

  async update(id: string, data: UpdatePurcachedCourseDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.PURCACHED_COURSES, "id", id)
    if (data.userId) await checkExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "id", data.userId)
    if (data.userId) await checkExistsResurs(this.prisma, ModelsEnumInPrisma.COURSES, "id", data.courseId)
    try {
      return {
        message: `This action updates a #${id} purcachedCourse`,
        data: await this.prisma.purcachedCourse.update({ where: { id: id }, data: { ...data } })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("PurcachedCourse update filed ", 500)
    }
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.PURCACHED_COURSES, "id", id)
    try {
      return {
        message: `This action removes a #${id} purcachedCourse`,
        data: await this.prisma.purcachedCourse.delete({ where: { id: id } })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("PurcachedCourse delete filed ", 500)
    }
  }
}
