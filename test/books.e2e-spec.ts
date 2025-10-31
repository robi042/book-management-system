import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Books (e2e)', () => {
  let app: INestApplication;
  let createdAuthorId: number;
  let createdBookId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply global validation pipe
    const { ValidationPipe } = await import('@nestjs/common');
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
    
    await app.init();

    // Create an author for book tests
    const authorResponse = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'An author for book tests',
      });
    createdAuthorId = authorResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /books', () => {
    it('should create a new book', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'The Test Novel',
          isbn: '978-3-16-148410-0',
          publishedDate: '2020-01-01',
          genre: 'Fiction',
          authorId: createdAuthorId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.title).toBe('The Test Novel');
          expect(res.body.isbn).toBe('978-3-16-148410-0');
          expect(res.body.author).toBeDefined();
          expect(res.body.author.id).toBe(createdAuthorId);
          createdBookId = res.body.id;
        });
    });

    it('should return 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          // isbn is missing
          authorId: createdAuthorId,
        })
        .expect(400);
    });

    it('should return 400 when author does not exist', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          isbn: '978-3-16-148410-1',
          authorId: 99999,
        })
        .expect(400);
    });
  });

  describe('GET /books', () => {
    it('should return a list of books', () => {
      return request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.total).toBeDefined();
        });
    });

    it('should filter books by authorId', () => {
      return request(app.getHttpServer())
        .get(`/books?authorId=${createdAuthorId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('GET /books/:id', () => {
    it('should return a specific book', () => {
      return request(app.getHttpServer())
        .get(`/books/${createdBookId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdBookId);
          expect(res.body.title).toBe('The Test Novel');
          expect(res.body.author).toBeDefined();
        });
    });

    it('should return 404 for non-existent book', () => {
      return request(app.getHttpServer())
        .get('/books/99999')
        .expect(404);
    });
  });

  describe('PATCH /books/:id', () => {
    it('should update a book', () => {
      return request(app.getHttpServer())
        .patch(`/books/${createdBookId}`)
        .send({
          genre: 'Science Fiction',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.genre).toBe('Science Fiction');
        });
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete a book', () => {
      return request(app.getHttpServer())
        .delete(`/books/${createdBookId}`)
        .expect(204);
    });

    it('should return 404 for non-existent book', () => {
      return request(app.getHttpServer())
        .delete('/books/99999')
        .expect(404);
    });
  });
});

