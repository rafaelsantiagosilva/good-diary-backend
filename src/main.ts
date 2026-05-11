import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { EnvService } from './modules/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  // Zod config
  app.useGlobalPipes(new ZodValidationPipe());

  // Scalar config
  const config = new DocumentBuilder()
    .setTitle("Good Diary")
    .setDescription("Documentação da API do Good Diary.")
    .setVersion("1.0")
    .addTag("Auth", "Rotas envolvendo a autenticação do usuário.")
    .addTag("User", "Rotas envolvendo a manipulação de entidades e registros de usuários.")
    .addTag("Note", "Rotas envolvendo a manipulação de entidades e registros de notas, criados por usuários.")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    "/reference",
    apiReference({
      content: document,
      theme: "kepler",
      withFastify: true
    })
  );

  const port = app.get(EnvService).get("PORT");
  await app.listen(port!, "0.0.0.0");
}

bootstrap();
