import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Book } from 'src/models/book.entity';

@Table({
  tableName: 'authors',
  timestamps: true,
})
export class Author extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare bio: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare birthDate: Date;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => Book)
  declare books: Book[];
}

