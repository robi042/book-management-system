import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authors (e2e)', () => {
  let app: INestApplication;
  let createdAuthorId: number;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /authors', () => {
    it('should create a new author', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          bio: 'A prolific writer',
          birthDate: '1980-01-01',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.firstName).toBe('John');
          expect(res.body.lastName).toBe('Doe');
          createdAuthorId = res.body.id;
        });
    });

    it('should return 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send({
          firstName: 'John',
          // lastName is missing
        })
        .expect(400);
    });
  });

  describe('GET /authors', () => {
    it('should return a list of authors', () => {
      return request(app.getHttpServer())
        .get('/authors')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.total).toBeDefined();
          expect(res.body.page).toBeDefined();
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/authors?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe(1);
          expect(res.body.limit).toBe(5);
        });
    });

    it('should support search', () => {
      return request(app.getHttpServer())
        .get('/authors?search=John')
        .expect(200);
    });
  });

  describe('GET /authors/:id', () => {
    it('should return a specific author', () => {
      return request(app.getHttpServer())
        .get(`/authors/${createdAuthorId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdAuthorId);
          expect(res.body.firstName).toBe('John');
          expect(res.body.lastName).toBe('Doe');
        });
    });

    it('should return 404 for non-existent author', () => {
      return request(app.getHttpServer())
        .get('/authors/99999')
        .expect(404);
    });
  });

  describe('PATCH /authors/:id', () => {
    it('should update an author', () => {
      return request(app.getHttpServer())
        .patch(`/authors/${createdAuthorId}`)
        .send({
          bio: 'Updated bio',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.bio).toBe('Updated bio');
        });
    });

    it('should return 404 for non-existent author', () => {
      return request(app.getHttpServer())
        .patch('/authors/99999')
        .send({ bio: 'Updated bio' })
        .expect(404);
    });
  });

  describe('DELETE /authors/:id', () => {
    it('should delete an author', () => {
      return request(app.getHttpServer())
        .delete(`/authors/${createdAuthorId}`)
        .expect(204);
    });

    it('should return 404 for non-existent author', () => {
      return request(app.getHttpServer())
        .delete('/authors/99999')
        .expect(404);
    });
  });
});

