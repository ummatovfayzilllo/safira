import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initGlobalApp } from './core/use_initilation';
import { checkMemoryAfterDeploy } from './core/memory.manitoring_functions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initGlobalApp(app);
  await app.listen(process.env.PORT ?? 15975);
  console.log(process.env.APP_BASE_URL + '/api-docs');
  console.log('Action test');
  // checkMemoryAfterDeploy()
  console.log('Memory function tugadi ');
}
bootstrap();
