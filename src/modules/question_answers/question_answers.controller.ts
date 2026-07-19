import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionAnswersService } from './question_answers.service';
import { CreateQuestionAnswerDto } from './dto/create-question_answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question_answer.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { QuestionAnswerApiBody } from 'src/common/types/api.body.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/utils/file.storage';

@Controller('question-answers')
export class QuestionAnswersController {
  constructor(
    private readonly questionAnswersService: QuestionAnswersService,
  ) {}

  @Post('create')
  @ApiConsumes('multipart')
  @ApiBody(QuestionAnswerApiBody)
  @UseInterceptors(
    FileInterceptor('files', fileStorages(['image', 'application', 'video'])),
  )
  create(@Body() data: CreateQuestionAnswerDto) {
    return this.questionAnswersService.create(data);
  }

  @Get()
  findAll() {
    return this.questionAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionAnswersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateQuestionAnswerDto) {
    return this.questionAnswersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionAnswersService.remove(id);
  }
}
