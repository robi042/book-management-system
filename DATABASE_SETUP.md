# Database Setup Instructions

## Quick Start

This project uses PostgreSQL with Sequelize ORM. Follow these steps to set up your database:

### 1. Configure Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=book_management
PORT=3000
```

### 2. Run the Application

```bash
# Development mode (auto-sync schema)
npm run start:dev

# Or build and run
npm run build
npm run start:prod
```

## Database Schema

The application will automatically create the following tables:

### Authors Table
- `id` (integer, primary key)
- `firstName` (string, required)
- `lastName` (string, required)
- `bio` (text, optional)
- `birthDate` (date, optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Books Table
- `id` (integer, primary key)
- `title` (string, required)
- `isbn` (string, unique, required)
- `publishedDate` (date, optional)
- `genre` (string, optional)
- `authorId` (integer, foreign key to authors)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

