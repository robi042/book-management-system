import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { Author } from 'src/models/author.entity';
import { CreateAuthorDto } from 'src/dto/author/create-author.dto';
import { AuthorsService } from './authors.service';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorRepository: typeof Author;

  const mockAuthorRepository = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getModelToken(Author),
          useValue: mockAuthorRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    authorRepository = module.get<typeof Author>(getModelToken(Author));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test author bio',
      };

      const mockAuthor = {
        id: 1,
        ...createAuthorDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockAuthorRepository.create.mockResolvedValue(mockAuthor);

      const result = await service.create(createAuthorDto);

      expect(result).toEqual(mockAuthor);
      expect(mockAuthorRepository.create).toHaveBeenCalledWith(createAuthorDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated authors', async () => {
      const mockAuthors = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' },
      ];

      mockAuthorRepository.findAndCountAll.mockResolvedValue({
        rows: mockAuthors,
        count: 2,
      });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockAuthors);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(mockAuthorRepository.findAndCountAll).toHaveBeenCalled();
    });

    it('should filter authors by search term', async () => {
      const searchResults = [{ id: 1, firstName: 'John', lastName: 'Doe' }];

      mockAuthorRepository.findAndCountAll.mockResolvedValue({
        rows: searchResults,
        count: 1,
      });

      const result = await service.findAll({ page: 1, limit: 10, search: 'John' });

      expect(result.data).toEqual(searchResults);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return an author by id', async () => {
      const mockAuthor = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
      } as any;

      mockAuthorRepository.findByPk.mockResolvedValue(mockAuthor);

      const result = await service.findOne(1);

      expect(result).toEqual(mockAuthor);
      expect(mockAuthorRepository.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when author not found', async () => {
      mockAuthorRepository.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const mockAuthor = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Old bio',
        update: jest.fn().mockResolvedValue({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          bio: 'New bio',
        }),
      } as any;

      mockAuthorRepository.findByPk.mockResolvedValue(mockAuthor);

      const updateDto = { bio: 'New bio' };
      const result = await service.update(1, updateDto);

      expect(mockAuthor.update).toHaveBeenCalledWith(updateDto);
    });
  });

  describe('remove', () => {
    it('should delete an author', async () => {
      const mockAuthor = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        destroy: jest.fn().mockResolvedValue(true),
      } as any;

      mockAuthorRepository.findByPk.mockResolvedValue(mockAuthor);

      await service.remove(1);

      expect(mockAuthor.destroy).toHaveBeenCalled();
    });
  });
});

