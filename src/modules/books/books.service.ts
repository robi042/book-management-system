import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Book } from '../../models/book.entity';
import { Author } from 'src/models/author.entity';
import { CreateBookDto } from '../../dto/book/create-book.dto';
import { UpdateBookDto } from '../../dto/book/update-book.dto';
import { QueryBookDto } from '../../dto/book/query-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookRepository: typeof Book,
    @InjectModel(Author)
    private authorRepository: typeof Author,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Verify that the author exists
    const author = await this.authorRepository.findByPk(createBookDto.authorId);
    if (!author) {
      throw new BadRequestException(
        `Author with ID ${createBookDto.authorId} does not exist`,
      );
    }

    try {
      const book = await this.bookRepository.create(createBookDto as any);
      return this.findOne(book.id);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('ISBN already exists');
      }
      throw error;
    }
  }

  async findAll(queryDto: QueryBookDto) {
    const { page = 1, limit = 10, search, authorId } = queryDto;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { isbn: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const { rows, count } = await this.bookRepository.findAndCountAll({
      where,
      include: [{ model: Author }],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findByPk(id, {
      include: [{ model: Author }],
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    // Verify that the author exists if authorId is being updated
    if (updateBookDto.authorId) {
      const author = await this.authorRepository.findByPk(
        updateBookDto.authorId,
      );
      if (!author) {
        throw new BadRequestException(
          `Author with ID ${updateBookDto.authorId} does not exist`,
        );
      }
    }

    try {
      await book.update(updateBookDto);
      return this.findOne(id);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('ISBN already exists');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await book.destroy();
  }
}

