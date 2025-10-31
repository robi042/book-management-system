import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './helpers';
import { Sequelize } from 'sequelize-typescript';
import { localize } from './middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('bms');

  // Bind i18n if available (avoids type errors without package)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { expressBind } = require('i18n-2');
    expressBind(app, { locales: ['en'] });
  } catch {}

  app.use(localize);
  
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Apply global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global request logging using winston helpers (URL + body)
  app.use(async (req: any, _res: any, next: () => void) => {
    try {
      const { HttpUrlLog, requestBodyLog } = await import('./config/winstonLog');
      HttpUrlLog(`${req.method} ${req.originalUrl || req.url}`);
      if (req.body) {
        requestBodyLog(req.body);
      }
    } catch {}
    next();
  });

  // Verify DB connection and log via winston if available
  const sequelize = app.get(Sequelize);
  await sequelize.authenticate();
  try {
    const { nestwinstonLog, winstonLog } = await import('./config/winstonLog');
    app.useLogger(nestwinstonLog);
    winstonLog.info('Database connection established');
  } catch {
    // Fallback if logger deps are not installed
    // eslint-disable-next-line no-console
    console.log('Database connection established');
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  try {
    const { HttpPortLog } = await import('./config/winstonLog');
    HttpPortLog(port);
  } catch {
    // eslint-disable-next-line no-console
    console.log(`Nest Application Run In Port ${port}`);
  }
}
bootstrap();
