import { Injectable } from '@nestjs/common';
import { CreateQuestionAnswerDto } from './dto/create-question_answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question_answer.dto';

@Injectable()
export class QuestionAnswersService {
  create(createQuestionAnswerDto: CreateQuestionAnswerDto) {
    return 'This action adds a new questionAnswer';
  }

  findAll() {
    return `This action returns all questionAnswers`;
  }

  findOne(id: string) {
    return `This action returns a #${id} questionAnswer`;
  }

  update(id: string, updateQuestionAnswerDto: UpdateQuestionAnswerDto) {
    return `This action updates a #${id} questionAnswer`;
  }

  remove(id: string) {
    return `This action removes a #${id} questionAnswer`;
  }
}

/*
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc1ZTMxNmFkLTU4Y2QtNDhjNy04Yzg5LTEzYzAxYjY3Y2RiMiIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzUzNzA4Nzk1LCJleHAiOjE3NTM3OTUxOTV9.kZiCUNSyA_QZAzTTnTNds1ZFzlYm23eQKbCu8iyIboo",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc1ZTMxNmFkLTU4Y2QtNDhjNy04Yzg5LTEzYzAxYjY3Y2RiMiIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzUzNzA4Nzk1LCJleHAiOjE3NTQzMTM1OTV9.fygjDzWv-0mC61EMbc-cvskTTGkZar3GQMyVV3XnJIg"
}
*/
