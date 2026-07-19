import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { QuestionApiBody } from 'src/common/types/api.body.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/utils/file.storage';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody(QuestionApiBody)
  @UseInterceptors(
    FileInterceptor(
      'files',
      fileStorages(['image', 'text', 'application', 'video']),
    ),
  )
  create(
    @Body() data: CreateQuestionDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.questionsService.create(data, files);
  }

  @Get('get-all')
  findAll() {
    return this.questionsService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() data: UpdateQuestionDto) {
    return this.questionsService.update(id, data);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
