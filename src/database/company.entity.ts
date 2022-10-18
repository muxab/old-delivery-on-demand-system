import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyType } from './company-type.entity';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => CompanyType, (type) => type.companies)
  type: CompanyType;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.company)
  vehicles: Vehicle[];

  @OneToMany(() => User, (user) => user.company)
  drivers: User[];

  @OneToMany(() => User, (user) => user.company)
  reps: User[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated: Date;
}
