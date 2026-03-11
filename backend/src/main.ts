import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mail Sender Manager API')
    .setDescription('REST endpoints (Swagger) + GraphQL at /graphql')
    .setVersion('0.0.1')
    .addTag('graphql', 'GraphQL endpoint: /graphql')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`GraphQL: http://localhost:${port}/graphql`);
  console.log(`Swagger: http://localhost:${port}/api`);
}
bootstrap();
