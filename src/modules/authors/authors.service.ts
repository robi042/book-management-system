import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Author } from '../../models/author.entity';
import { CreateAuthorDto } from 'src/dto/author/create-author.dto';
import { UpdateAuthorDto } from 'src/dto/author/update-author.dto';
import { QueryAuthorDto } from 'src/dto/author/query-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author)
    private authorRepository: typeof Author,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = await this.authorRepository.create(createAuthorDto as any);
    return author;
  }

  async findAll(queryDto: QueryAuthorDto) {
    const { page = 1, limit = 10, search } = queryDto;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.authorRepository.findAndCountAll({
      where,
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

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository.findByPk(id);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);
    await author.update(updateAuthorDto);
    return author;
  }

  async remove(id: number): Promise<void> {
    const author = await this.findOne(id);
    await author.destroy();
  }
}

