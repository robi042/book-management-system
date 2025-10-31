import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { Author } from '../../models/author.entity';

@Module({
  imports: [SequelizeModule.forFeature([Author])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}

