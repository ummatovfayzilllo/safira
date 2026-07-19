import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LessonFilesService } from './lesson_files.service';
import { CreateLessonFileDto } from './dto/create-lesson_file.dto';
import { UpdateLessonFileDto } from './dto/update-lesson_file.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/utils/file.storage';
import { lessonFileApiBody } from 'src/common/types/api.body.types';

@Controller('lesson-files')
export class LeesonFilesController {
  constructor(private readonly lessonFilesService: LessonFilesService) {}

  @Post('v1/create-one')
  @ApiConsumes('multipart/form-data')
  @ApiBody(lessonFileApiBody)
  @UseInterceptors(
    FileInterceptor(
      'file',
      fileStorages(['application', 'image', 'video', 'text']),
    ),
  )
  create(
    @Body() createLessonFileDto: CreateLessonFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filename: string | undefined = file.filename;
    return this.lessonFilesService.create(createLessonFileDto, filename);
  }

  @Get('v2/get-all')
  findAll() {
    return this.lessonFilesService.findAll();
  }

  @Get('v3/get-one/:id')
  findOne(@Param('id') id: string) {
    return this.lessonFilesService.findOne(id);
  }

  @Patch('v4/update-one/:id')
  update(
    @Param('id') id: string,
    @Body() updateLessonFileDto: UpdateLessonFileDto,
  ) {
    return this.lessonFilesService.update(id, updateLessonFileDto);
  }

  @Delete('v5/delete-one/:id')
  remove(@Param('id') id: string) {
    return this.lessonFilesService.remove(id);
  }
}
