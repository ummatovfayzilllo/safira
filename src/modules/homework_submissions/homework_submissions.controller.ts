import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { HomeworkSubmissionsService } from './homework_submissions.service';
import { CreateHomeworkSubmissionDto } from './dto/create-homework_submission.dto';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework_submission.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { homeworkSubmissionFileApiBody } from 'src/common/types/api.body.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/utils/file.storage';

@Controller('homework-submissions')
export class HomeworkSubmissionsController {
  constructor(
    private readonly homeworkSubmissionsService: HomeworkSubmissionsService,
  ) {}

  @Post("create")
  @ApiConsumes("multipart/form-data")
  @ApiBody(homeworkSubmissionFileApiBody)
  @UseInterceptors(FileInterceptor("files",fileStorages(["image","text","application","video"])))
  create(
    @Body() data: CreateHomeworkSubmissionDto,
    @UploadedFiles() files : Express.Multer.File[]
  ) {
    return this.homeworkSubmissionsService.create(data);
  }

  @Get("get-all")
  findAll() {
    return this.homeworkSubmissionsService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.homeworkSubmissionsService.findOne(id);
  }

  @Patch('update-one/:id')
  update(
    @Param('id') id: string,
    @Body() updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto,
  ) {
    return this.homeworkSubmissionsService.update(
      id,
      updateHomeworkSubmissionDto,
    );
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.homeworkSubmissionsService.remove(id);
  }
}
