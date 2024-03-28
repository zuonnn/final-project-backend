import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(helmet());
  app.use(compression());  
  app.use(cookieParser());
  app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	await app.listen(configService.get('PORT'), () =>
		logger.log(`Application running on port ${configService.get('PORT')}`),
	);
  
}
bootstrap();
