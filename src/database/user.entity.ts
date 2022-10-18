import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/utils/roles/role.enum';
import { Company } from './company.entity';
import { Vehicle } from './vehicle.entity';
import { Shipment } from './shipment.entity';
import { Journey } from './journey.entity';
import { Exclude } from 'class-transformer';
import { Notification } from './notification.entity';
import { Invoice } from './invoice.entity';
import { Report } from './report.entity';
import { AccountStatus } from 'src/utils/roles/account-status.enum';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  b_id: string;

  @Column({ nullable: false, unique: false })
  name: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ nullable: false, unique: true })
  email: string;


  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, default : 20 })
  balance: number;

  @Column({ nullable: true, unique: true })
  lecNo: string;

  @Column({ nullable: true, unique: true })
  lecPath: string;

 

  @Column({ nullable: false, default: false })
  isCompany: boolean;

  @Column({ nullable: false })
  company_name: string;

  @Exclude()
  @Column({ nullable: false, default: 0 })
  credit: number;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @OneToOne(() => Journey, (journey) => journey.driver)
  journey: Journey;

  @ManyToOne(() => Company, (company) => company.drivers)
  company: Company;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.driver)
  vehicle: Vehicle;

  @OneToMany(() => Shipment, (shipment) => shipment.owner)
  shipments: Shipment[];


  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];


  @OneToMany(() => Invoice, (invoice) => invoice.accountant)
  invoices_editing: Invoice[];

  @OneToMany(() => Shipment, (shipments) => shipments.accountant)
  shipments_edidting: Shipment[];

  @OneToMany(() => Report, (reports) => reports.user, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  reports: Report[];


  @OneToMany(() => Journey, (journeys) => journeys.accountant)
  edited_journeys: Journey[];



  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  created: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated: Date;

}
