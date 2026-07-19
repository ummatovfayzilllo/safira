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
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/utils/file.storage';
import { lessonApiBody } from 'src/common/types/api.body.types';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @Post("create-one")
  @ApiConsumes("multipart/form-data")
  @ApiBody(lessonApiBody)
  @UseInterceptors(FileInterceptor("video",fileStorages(["application", "image", "video","text"])))
  create(
    @Body() data: CreateLessonDto,
    @UploadedFile() video : Express.Multer.File
  ) {
    return this.lessonsService.create(data,video.filename);
  }

  @Get("getall")
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch('update-oen/:id')
  update(@Param('id') id: string, @Body() data: UpdateLessonDto) {
    return this.lessonsService.update(id, data);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
