import { HttpException, Injectable } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { urlGenerator } from 'src/common/utils/generators';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { unlinkFile } from 'src/common/utils/file.helpers';
import { Homework } from '@prisma/client';

@Injectable()
export class HomeworksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }
  async create(data: CreateHomeworkDto, files: Express.Multer.File[]) {
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.LESSONS,"id",data.lessonId)
    data['files'] = files.map(file => {
      return urlGenerator(this.config, file.filename)
    })
    try {
      return {
        message: 'This action adds a new homework',
        data: await this.prisma.homework.create({
          data: data
        })
      };
    } catch (error) {
      console.log(error.message)
      throw new HttpException("Homework create filed", 500)
    }
  }

  async findAll() {
    try {
      return {
        message: `This action returns all homeworks`,
        data: await this.prisma.homework.findMany()
      };
    } catch (error) {
      console.log(error.message)
      throw new HttpException("Homeworks read filed !", 500)
    }
  }

  async findOne(id: string) {
    return {
      message: `This action returns a #${id} homework`,
      data: await checkExistsResurs(this.prisma, ModelsEnumInPrisma.HOMEWORKS, "id", id)
    };
  }

  async update(id: string, data: UpdateHomeworkDto, files: Express.Multer.File[] | undefined) {
    const oldHomework = await checkExistsResurs<Homework>(this.prisma, ModelsEnumInPrisma.HOMEWORKS, "id", id)
    try {
      try {
        if (oldHomework.files) {
          oldHomework.files.map(async (file) => {
            if (file && typeof file === "string") {
              const fileName = file.split("/").at(-1)
              unlinkFile(fileName || "")
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
      if (files) {
        data['files'] = files.map(async (file) => {
          return urlGenerator(this.config, file.filename)
        })
      }
      return {
        message: `This action updates a #${id} homework`,
        data: await this.prisma.homework.update({
          where: { id: id },
          data: data
        })
      };
    } catch (error) {
      console.log(error.message)
      throw new HttpException("Homework update filed !", 500)
    }
  }

  async remove(id: string) {
    const oldHomework = await checkExistsResurs<Homework>(this.prisma, ModelsEnumInPrisma.HOMEWORKS, "id", id)
    try {
      const deletedHomework = await this.prisma.homework.delete({ where: { id: id } })
      try {
        if (oldHomework.files) {
          oldHomework.files.map(async (file) => {
            if (file && typeof file === "string") {
              const fileName = file.split("/").at(-1)
              unlinkFile(fileName || "")
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
      return {
        message : `This action removes a #${id} homework`,
        data : deletedHomework
      };
    } catch (error) {
      console.log(error.message)
      throw new HttpException("Homework delete filed  !", 500)
    }
  }
}
