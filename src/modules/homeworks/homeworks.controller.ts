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
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/utils/file.storage';
import { homeworkFIleApiBody } from 'src/common/types/api.body.types';

@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody(homeworkFIleApiBody)
  @UseInterceptors(
    FilesInterceptor(
      'files',
      10,
      fileStorages(['image', 'video', 'application', 'text']),
    ),
  )
  create(
    @Body() data: CreateHomeworkDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.homeworksService.create(data, files);
  }

  @Get('get-all')
  findAll() {
    return this.homeworksService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.homeworksService.findOne(id);
  }

  @Patch('update-one/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody(homeworkFIleApiBody)
  @UseInterceptors(
    FilesInterceptor(
      'files',
      10,
      fileStorages(['image', 'video', 'application', 'text']),
    ),
  )
  update(
    @Param('id') id: string,
    @Body() data: UpdateHomeworkDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.homeworksService.update(id, data, files);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.homeworksService.remove(id);
  }
}
