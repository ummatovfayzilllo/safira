import { CourseLevelArr, HomeWorkSubStatusArr } from './enum.types';

export const lessonApiBody = {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      about: { type: 'string' },
      lessonModulId: { type: 'string' },
      video: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const lessonFileApiBody = {
  schema: {
    type: 'object',
    properties: {
      note: { type: 'string' },
      lessonId: { type: 'string' },
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const homeworkFIleApiBody = {
  schema: {
    type: 'object',
    properties: {
      task: { type: 'string' },
      lessonId: { type: 'string' },
      files: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },
};

export const userApiBody = {
  schema: {
    type: 'object',
    properties: {
      fullName: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const courseApiBody = {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      about: { type: 'string' },
      price: { type: 'number' },
      discount: { type: 'number' },
      categoryId: { type: 'string' },
      mentorId: { type: 'string' },
      published: { type: 'boolean' },
      level: {
        type: 'string',
        enum: CourseLevelArr,
      },
      banner: {
        type: 'string',
        format: 'binary',
      },
      introVideo: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const homeworkSubmissionFileApiBody = {
  schema: {
    type: 'object',
    properties: {
      text: { type: 'string' },
      reason: { type: 'string' },
      status: { enum: HomeWorkSubStatusArr },
      lessonId: { type: 'string' },
      homeworkId: { type: 'string' },
      userId: { type: 'string' },
      files: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },
};

export const QuestionApiBody = {
  description: 'Savol yuborish uchun forma',
  schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        format: 'uuid',
        example: 'a38a4c79-4ac6-45b1-9f25-1ef0d1037e0f',
        description: 'Foydalanuvchi UUID',
      },
      courseId: {
        type: 'string',
        format: 'uuid',
        example: 'bd8277f9-d9a8-403e-b99f-6b7bcf70a9df',
        description: 'Kurs UUID',
      },
      text: {
        type: 'string',
        example: 'NestJS interceptorlar qanday ishlaydi?',
        description: 'Savol matni',
      },
      read: {
        type: 'boolean',
        example: false,
        description: "Savol o'qilganmi yoki yo'q",
      },
      readAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-07-28T11:30:00.000Z',
        description: "Savol o'qilgan vaqti",
      },
      files: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
          description: 'Yuklanayotgan fayl (ixtiyoriy)',
        },
      },
    },
    required: ['userId', 'courseId', 'text', 'read', 'readAt'],
  },
};

export const QuestionAnswerApiBody = {
  description: 'Savolga javob yuborish uchun forma',
  schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        format: 'uuid',
        example: 'd13a2b71-b8b4-4fc1-b5d2-cc5fc17bfa8f',
        description: 'Javob yozayotgan foydalanuvchining UUID identifikatori',
      },
      questionId: {
        type: 'string',
        format: 'uuid',
        example: 'a3f2e1d5-8c29-4a5c-8cc9-25e9c4b85a94',
        description: 'Javob berilayotgan savol UUID identifikatori',
      },
      text: {
        type: 'string',
        example:
          "Interceptorlar HTTP so'rovlarining oldidan va keyin bajariladi.",
        description: 'Foydalanuvchi tomonidan yozilgan javob matni',
      },
      files: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
          description: 'Yuklanayotgan fayl (ixtiyoriy)',
        },
      },
    },
    required: ['userId', 'questionId', 'text'],
  },
};
// @ApiBody({
//   schema: {
//     type: 'object',
//     properties: {
//       name: { type: 'string' },
//       about: { type: 'string' },
//       price: { type: 'number' },
//       categoryId: { type: 'string' },
//       mentorId: { type: 'string' },
//       published: { type: 'boolean' },
//       banner: {
//         type: 'string',
//         format: 'binary',
//       },
//       introVideo: {
//         type: 'string',
//         format: 'binary',
//       },
//     },
//   },
// })
