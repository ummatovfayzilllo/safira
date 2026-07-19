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
  BadGatewayException,
  HttpException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { courseFileFields, fileStorages } from 'src/common/utils/file.storage';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { courseApiBody } from 'src/common/types/api.body.types';
import { Public } from 'src/global/decorators/auth.decorators';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create-one')
  @ApiConsumes('multipart/form-data')
  @ApiBody(courseApiBody)
  @UseInterceptors(
    FileFieldsInterceptor(courseFileFields, fileStorages(['image', 'video'])),
  )
  createCourse(
    @Body() data: CreateCourseDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      let banner = 'null';
      let introVideo = 'null';
      if (files['banner']) {
        banner = files['banner'][0].filename;
      }
      if (files['introVideo']) {
        console.log(files['introVideo']);
        introVideo = files['introVideo'][0].filename;
      }
      return this.coursesService.create(data, banner, introVideo);
    } catch (error) {
      throw new BadGatewayException('Invalid fields name files');
    }
  }
  @Public()
  @Get('getall')
  findAll() {
    return this.coursesService.findAll();
  }

  @Public()
  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @Patch('update-one/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody(courseApiBody)
  @UseInterceptors(
    FileFieldsInterceptor(courseFileFields, fileStorages(['images', 'video'])),
  )
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      let banner: string | undefined = undefined;
      let introVideo: string | undefined = undefined;
      if (files['banner']) {
        banner = files['banner'][0].filename;
      }
      if (files['introVideo']) {
        console.log(files['introVideo']);
        introVideo = files['introVideo'][0].filename;
      }
      return this.coursesService.update(
        id,
        updateCourseDto,
        banner,
        introVideo,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException('Course update filed ', 500);
    }
  }

  @Delete('delte-one/:id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
