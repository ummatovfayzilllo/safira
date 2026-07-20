import { HttpException, Injectable } from '@nestjs/common';
import { CreateLessonFileDto } from './dto/create-lesson_file.dto';
import { UpdateLessonFileDto } from './dto/update-lesson_file.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { urlGenerator } from 'src/common/utils/generators';
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class LessonFilesService {
  constructor(
    private readonly prisma: PrismaService,
    private config: ConfigService,
  ) {}

  private withFileUrl<T extends { file?: string | null }>(record: T): T {
    return {
      ...record,
      file: record.file ? urlGenerator(this.config, record.file) : record.file,
    };
  }

  async create(data: CreateLessonFileDto, fileName?: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LESSONS,
      'id',
      data.lessonId,
    );
    try {
      if (fileName) {
        data['file'] = fileName;
      }
      const created = await this.prisma.lessonFile.create({
        data: { ...data },
      });
      return {
        message: 'This action adds a new lessonFile',
        data: this.withFileUrl(created),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('LessonFile column create filed', 500);
    }
  }

  async findAll() {
    try {
      const lessonFiles = await this.prisma.lessonFile.findMany();
      return {
        message: `This action returns all lessonFiles`,
        data: lessonFiles.map((file) => this.withFileUrl(file)),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('LessonFiles read all filed ', 500);
    }
  }

  async findOne(id: string) {
    const lessonFile = await checkExistsResurs<{ file?: string | null }>(
      this.prisma,
      ModelsEnumInPrisma.LESSON_FILES,
      'id',
      id,
    );
    return {
      message: `This action returns a #${id} lessonFile`,
      data: this.withFileUrl(lessonFile),
    };
  }

  async update(id: string, data: UpdateLessonFileDto, fileName?: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LESSON_FILES,
      'id',
      id,
    );
    try {
      if (fileName) {
        data['file'] = fileName;
      }
      const updated = await this.prisma.lessonFile.update({
        where: { id: id },
        data: { ...data },
      });
      return {
        message: `This action updates a #${id} lessonFile`,
        data: this.withFileUrl(updated),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('LessonFile update filed ', 500);
    }
  }

  async remove(id: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.LESSON_FILES,
      'id',
      id,
    );
    try {
      return {
        message: `This action removes a #${id} lessonFile`,
        data: await this.prisma.lessonFile.delete({ where: { id: id } }),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Lessofile delete filed', 500);
    }
  }
}
