import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { Author } from '../../models/author.entity';
import { Book } from 'src/models/book.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'book_management',
      dialectOptions: process.env.SSL === 'true' || process.env.DB_HOST?.includes('aivencloud.com') 
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
      models: [Author, Book],
      autoLoadModels: true,
      synchronize: true, // Set to false in production
      logging: false, // Disable SQL query logging in console
    }),
  ],
})
export class DatabaseModule {}

