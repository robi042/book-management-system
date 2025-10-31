import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Author } from 'src/models/author.entity';


@Table({
  tableName: 'books',
  timestamps: true,
})
export class Book extends Model {
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
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare isbn: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare publishedDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare genre: string;

  @ForeignKey(() => Author)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare authorId: number;

  @BelongsTo(() => Author)
  declare author: Author;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

