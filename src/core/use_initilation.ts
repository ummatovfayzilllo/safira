import {
  ValidationPipe,
  INestApplication,
  BadRequestException,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MulterValidationExceptionFilter } from './error/validation.filter';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import * as cookieParser from 'cookie-parser';
import { DeviceMiddleware } from 'src/global/middlewares/device.middleware';

export const initGlobalApp = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Edfix Clone API')
    .setDescription('Education Management System - API Documentation')
    .setVersion('1.0.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'Users management')
    .addTag('courses', 'Courses management')
    .build();

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 400,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {}).join(', '),
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  );

  // Global Prefix
  app.setGlobalPrefix('api');

  // Cookie Parser Middleware
  app.use(cookieParser());

  // Swagger Documentation
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const darkThemeCss = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);

  SwaggerModule.setup('api-docs', app, document, {
    customCss: darkThemeCss,
    customSiteTitle: 'Edfix Clone API Docs',
  });

  // Device Middleware
  app.use(new DeviceMiddleware().use);

  // Global Exception Filters
  app.useGlobalFilters(new MulterValidationExceptionFilter());

  // CORS Configuration
  app.enableCors({
    origin: (origin, callback) => {
      // TODO: Development - all origins allowed. Production: configure allowed origins
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
};
