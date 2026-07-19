import { HttpException, Injectable } from '@nestjs/common';
import { CreateHomeworkSubmissionDto } from './dto/create-homework_submission.dto';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework_submission.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { urlGenerator } from 'src/common/utils/generators';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { HomeworkSubmission } from '@prisma/client';
import { unlinkFile } from 'src/common/utils/file.helpers';

@Injectable()
export class HomeworkSubmissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }
  async create(data: CreateHomeworkSubmissionDto, files?: Express.Multer.File[] | undefined) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.HOMEWORKS, "id", data.homeworkId)
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "id", data.userId)
    const oldHomeworkSubmission = await this.prisma.homeworkSubmission.findFirst({
      where: {
        AND: [
          { userId: data.userId },
          { homeworkId: data.homeworkId }
        ]
      }
    })
    if (files) {
      data['files'] = files.map(async (file) => {
        return urlGenerator(this.config, file.filename)
      })
    }
    if (oldHomeworkSubmission) {
      try {
        return {
          message: "Homework submission already exists and updated homework submission !",
          data: await this.prisma.homeworkSubmission.update({
            where: { id: oldHomeworkSubmission.id },
            data: { ...data }
          })
        }
      } catch (error) {
        console.log(error.message)
      }
    } else {
      try {
        return {
          messsage: 'This action adds a new homeworkSubmission',
          data: await this.prisma.homeworkSubmission.create({ data: data })
        };
      } catch (error) {
        console.log(error.message)
        throw new HttpException("Homework create filed", 500)
      }
    }
  }

  async findAll() {
    try {
      return {
        message: `This action returns all homeworkSubmissions`,
        data: await this.prisma.homeworkSubmission.findMany()
      };
    } catch (error) {
      console.log(error.message)
      throw new HttpException("Homework find all filed", 500)
    }
  }

  async findOne(id: string) {
    return {
      message: `This action returns a #${id} homeworkSubmission`,
      data: await checkExistsResurs(this.prisma, ModelsEnumInPrisma.HOMEWORK_SUBMISSIONS, "id", id)
    };
  }

  async update(id: string, data: UpdateHomeworkSubmissionDto, files?: Express.Multer.File[] | undefined) {
    if (data.homeworkId) await checkExistsResurs(this.prisma, ModelsEnumInPrisma.HOMEWORKS, "id", data.homeworkId)
    if (data.userId) await checkExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "id", data.userId)
    const oldHomeworkSubmission = await checkExistsResurs<HomeworkSubmission>(this.prisma, ModelsEnumInPrisma.HOMEWORK_SUBMISSIONS, "id", id)
    try {

      if (files) {
        data['files'] = files.map(async (file) => {
          return urlGenerator(this.config, file.filename)
        })
      }
      const updatedData = await this.prisma.homeworkSubmission.update({
        where: { id: id },
        data: data
      })
      if (oldHomeworkSubmission.files) {
        oldHomeworkSubmission.files.map(async (file) => {
          const fileName = file.split("/").at(-1)
          try {
            unlinkFile(fileName || "")
          } catch (error) {
            console.log(error.message)
          }
        })
      }
      return {
        message: `This action updates a #${id} homeworkSubmission`,
        data: updatedData
      };
    } catch (error) {
      console.log(error.message)
      throw new HttpException("HomeworkSubmission update filed !", 500)
    }
  }

  async remove(id: string) {
    const oldHomeworkSubmission = await checkExistsResurs<HomeworkSubmission>(this.prisma, ModelsEnumInPrisma.HOMEWORK_SUBMISSIONS, "id", id)

    try {
      const deletedData = await this.prisma.homeworkSubmission.delete({where : {id : id}})
      if (oldHomeworkSubmission.files) {
        oldHomeworkSubmission.files.map(async (file) => {
          const fileName = file.split("/").at(-1)
          try {
            unlinkFile(fileName || "")
          } catch (error) {
            console.log(error.message)
          }
        })
      }
      return {
        message : `This action removes a #${id} homeworkSubmission`,
        data : deletedData
      };
    } catch (error) {
      console.log(error.message)
      throw new HttpException("HomeworkSubmission delete filed !", 500)
    }
  }
}