import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @Column() title!: string;
  @Column() content!: string;
  @Column() isActive!: boolean;
  @PrimaryGeneratedColumn() id!: number
}
