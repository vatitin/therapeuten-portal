import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import supertokens from 'supertokens-node';
import { AppModule } from './app.module';
import { SupertokensExceptionFilter } from './auth/auth/auth.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://cdn.jsdelivr.net/gh/supertokens/',
                ],
                imgSrc: ['https://cdn.jsdelivr.net/gh/supertokens/'],
            },
        }),
    );

    //todo implement prefix
    //app.setGlobalPrefix('api');
    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
        credentials: true,
    });

    app.useGlobalFilters(new SupertokensExceptionFilter());

    await app.listen(3001);
}
bootstrap();
