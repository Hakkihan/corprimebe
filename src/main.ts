import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { CorsOptions } from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for HTTP requests
  app.enableCors({
    origin: '*', // You can replace * with your frontend domain for stricter CORS
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  });

  // Enable CORS for WebSocket connections
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3000);
}
bootstrap();
