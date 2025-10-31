import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from '../../models/book.entity';
import { Author } from 'src/models/author.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Book, Author]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}

