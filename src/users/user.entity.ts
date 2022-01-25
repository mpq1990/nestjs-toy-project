// import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  //   @Exclude()
  password: string;

  @AfterInsert()
  logInserts() {
    console.log('Inserted the user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated the user with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id', this.id);
  }
}
