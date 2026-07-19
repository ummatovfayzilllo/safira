import { HttpException, Injectable } from '@nestjs/common';
import { CreateAssignedCourseDto } from './dto/create-assigned_course.dto';
import { UpdateAssignedCourseDto } from './dto/update-assigned_course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class AssignedCoursesService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(data: CreateAssignedCourseDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.COURSES, "id", data.courseId)
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "id", data.userId)
    try {
      return {
        message: 'This action adds a new assignedCourse',
        data: await this.prisma.assignedCourse.create({ data: data })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("AssignedCourse create filed ", 500)
    }
  }

  async findAll() {
    try {
      return {
        message: `This action returns all assignedCourses`,
        data: await this.prisma.assignedCourse.findMany()
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("AssignedCourse read all filed ", 500)
    }
  }

  async findOne(id: string) {
    return {
      message: `This action returns a #${id} assignedCourse`,
      data: await checkExistsResurs(this.prisma, ModelsEnumInPrisma.ASSIGNED_COURSES, "id", id)
    };
  }

  async update(id: string, data: UpdateAssignedCourseDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.ASSIGNED_COURSES, "id", id)
    if(data.userId) checkExistsResurs(this.prisma,ModelsEnumInPrisma.USERS,"id",data.userId)
    if(data.courseId) checkExistsResurs(this.prisma,ModelsEnumInPrisma.COURSES,"id", data.courseId)
    try {
      return {
        message: `This action updates a #${id} assignedCourse`,
        data: await this.prisma.assignedCourse.update({
          where: { id: id },
          data: data
        })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("AssignedCourse update filed ", 500)
    }
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.ASSIGNED_COURSES, "id", id)
    try {
      return {
        messsage : `This action removes a #${id} assignedCourse`,
        data : await this.prisma.assignedCourse.delete({
          where : {id : id}
        })
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("AssignedCourse delete filed ", 500)
    }
  }
}
