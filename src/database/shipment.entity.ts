import { ShipmentStatus } from 'src/utils/enums/s-status.enum';
import { ShipmentPayment } from 'src/utils/enums/spayment.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { Journey } from './journey.entity';
import { Location } from './location.entity';
import { Report } from './report.entity';
import { ShipmentOffer } from './shipment-offer.entity';
import { User } from './user.entity';
import { VehicleType } from './vehicle-type.entity';

@Entity()
export class Shipment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: false })
  weight: number;

  @Column({ nullable: false })
  type_s: string;

  @Column({ nullable: true })
  extra: string;

  @Column({ nullable: true })
  expenses: number;

  @Column({ type: 'enum', enum: ShipmentPayment, default: ShipmentPayment.NO })
  payment: ShipmentPayment;

  
  @Column({ type: 'enum', enum: ShipmentStatus, default: ShipmentStatus.NEW })
  status: ShipmentStatus;

  @Column({ nullable: true })
  track_no: string;

  //  ---------------------------

  @Column({ nullable: true })
  journeyId: number;
  
  @ManyToOne(() => Journey, (journey) => journey.shipments, {
    onDelete: 'SET NULL',
    nullable: true
  })
  journey: Journey;

  @ManyToOne(() => Location, (location) => location.arrivals)
  destination: Location;

  @Column({ nullable: true })
  destinationId: number;

  @Column({ nullable: false })
  dest_address: string;

  @ManyToOne(() => Location, (location) => location.departures)
  origin: Location;

  @Column({ nullable: true })
  originId: number;

  @Column({ nullable: false })
  origin_address: string;
  

  // cancelation ShipmentType -- add vehicle type instead

  @Column({nullable : false})
  typeId : number;

  @ManyToOne(() => VehicleType, (vtype) => vtype.shipments)
  type: VehicleType;
  
  @Column({nullable : false})
  ownerId : number;
  
  @ManyToOne(() => User, (owner) => owner.shipments)
  owner: User;
  
  @OneToMany(()=> ShipmentOffer, (offers)=> offers.shipment)
  offers: ShipmentOffer[];

  @OneToOne(()=> Report , (report)=> report.shipment, {onDelete: 'SET NULL', onUpdate:'CASCADE'})
  reports: Report;

  @OneToMany(()=> Invoice ,(invoices)=> invoices.shipment)
  invoices :Invoice[];

  @ManyToOne(()=> User ,(user)=> user.shipments_edidting)
  accountant : User;

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
