// import { Exclude } from 'class-transformer';
import { Report } from '../reports/report.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  OneToMany,
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

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
