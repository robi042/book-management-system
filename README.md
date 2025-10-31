# Book Management System

A RESTful API for managing books and authors built with NestJS, TypeScript, and PostgreSQL using Sequelize ORM.

## Features

- **Authors Management**: Full CRUD operations for authors
- **Books Management**: Full CRUD operations for books with author relationships
- **Data Validation**: Input validation using class-validator
- **Error Handling**: Comprehensive error handling with custom filters
- **Pagination**: Built-in pagination support for listing endpoints
- **Search**: Search functionality for authors and books
- **Testing**: Unit tests and E2E tests included

```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your database by creating a PostgreSQL database:
```bash
createdb book_management
```

3. Configure environment variables (create `.env` file):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=book_management
PORT=3000
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authors

- `POST /authors` - Create a new author
- `GET /authors` - Get all authors (with pagination and search)
- `GET /authors/:id` - Get a specific author
- `PATCH /authors/:id` - Update an author
- `DELETE /authors/:id` - Delete an author

### Books

- `POST /books` - Create a new book
- `GET /books` - Get all books (with pagination, search, and filtering)
- `GET /books/:id` - Get a specific book
- `PATCH /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

## API Usage Examples

### Create an Author

```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "bio": "A prolific writer",
    "birthDate": "1980-01-01"
  }'
```

### Create a Book

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Novel",
    "isbn": "978-3-16-148410-0",
    "publishedDate": "2020-01-01",
    "genre": "Fantasy",
    "authorId": 1
  }'
```

### Get All Authors with Pagination

```bash
curl "http://localhost:3000/authors?page=1&limit=10&search=John"
```

### Get Books by Author

```bash
curl "http://localhost:3000/books?authorId=1"
```

## Testing

### Run Unit Tests

```bash
npm run test
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Run Tests with Coverage

```bash
npm run test:cov
```

## Database Choice and Considerations

**Current Implementation**: PostgreSQL with Sequelize ORM

**Why PostgreSQL?**
- **Reliability**: ACID compliance ensures data integrity
- **Robust Features**: Advanced features like foreign key constraints, transactions
- **Scalability**: Handles large datasets efficiently
- **Postgres-Specific Features**: JSON support, full-text search, etc.
- **Industry Standard**: Widely used in production environments

**Why Sequelize?**
- **TypeScript Support**: Excellent TypeScript integration with sequelize-typescript
- **Maturity**: Well-established ORM with extensive documentation
- **Flexibility**: Supports various database operations and complex queries
- **Migrations**: Built-in migration support for schema management
- **Associations**: Easy relationship management between entities

**Alternative Considerations:**
- **TypeORM**: More native TypeScript support, decorator-based
- **Prisma**: Modern ORM with excellent developer experience
- **Mongoose**: If using MongoDB instead of PostgreSQL

For production use, I would typically prefer:
1. **TypeORM** or **Prisma** for better TypeScript integration
2. **Prisma** for its excellent developer experience and type safety
3. **Raw SQL with pg** for maximum control and performance

## Project Requirements Fulfillment

✅ NestJS project initialized with TypeScript
✅ PostgreSQL with Sequelize ORM
✅ Author entity with all required fields
✅ Book entity with author relationship
✅ All API endpoints implemented
✅ Data validation using DTOs
✅ Error handling with custom filters
✅ Pagination and search support
✅ Unit tests for AuthorsService
✅ E2E tests for critical endpoints

## Development

```bash
# Watch mode
npm run start:dev

# Debug mode
npm run start:debug

# Build
npm run build

# Format code
npm run format

# Lint
npm run lint
```

## License

UNLICENSED
