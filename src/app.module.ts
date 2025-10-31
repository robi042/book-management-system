import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { BooksModule } from 'src/modules/books/books.module';

@Module({
  imports: [DatabaseModule, AuthorsModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
