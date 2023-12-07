import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth/auth.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //todo implement prefix
  //app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:3001'],
    //methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useGlobalFilters(new SupertokensExceptionFilter());

  await app.listen(3001);
}
bootstrap();
