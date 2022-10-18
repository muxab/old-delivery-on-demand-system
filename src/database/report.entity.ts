import { ReportType } from 'src/utils/enums/report-type.enum';
import { ShipmentPayment } from 'src/utils/enums/spayment.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Journey } from './journey.entity';
import { Shipment } from './shipment.entity';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';


@Entity('reports')
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;


  @OneToOne(()=> Shipment , (shipment)=> shipment.reports)
  @JoinColumn()
  shipment : Shipment;

  @OneToOne(()=> Journey , (journey)=> journey.report)
  @JoinColumn()
  journey : Journey;

  @ManyToOne(()=> User , (client)=> client.reports)
  user : User;

  @ManyToOne(()=> User , (client)=> client.reports)
  issued_by : User;


  @Column({ type: 'enum', enum: ReportType })
  report_type: ReportType;


  @ManyToOne(()=> Vehicle , (vehicle)=> vehicle.reports)
  vehicle : Vehicle;


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