import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  const config = new DocumentBuilder()
    .setTitle("Good Diary")
    .setDescription("The Good Diary API documentation.")
    .setVersion("1.0")
    .addTag("cats")
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

  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}

bootstrap();
