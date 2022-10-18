import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { Report } from './report.entity';
import { Shipment } from './shipment.entity';
import { User } from './user.entity';
import { VehicleType } from './vehicle-type.entity';
import { Vehicle } from './vehicle.entity';
// import { Journey } from './journey.entity';

@Entity()
export class Journey extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;


  @Column({ unique: true ,nullable:true})
  track_no: string;

  @Column({ nullable: true })
  wage: number;

  @Column({ nullable: true })
  changeReason: string;

  @Column({ nullable: true, default: false })
  changedVehicle: boolean;

  @Column({ type: 'enum', enum: JourneyStatus, default: JourneyStatus.NEW })
  status: JourneyStatus;

  @OneToOne(() => User, (user) => user.journey)
  @JoinTable()
  driver: User;

  @ManyToOne(() => Location, (location) => location.arrivals)
  destination: Location;

  @Column({ nullable: false })
  dest_address: string;

  @ManyToOne(() => Location, (location) => location.departures)
  origin: Location;

  @Column({ nullable: false })
  origin_address: string;

  @Column({nullable:true })
  vehicleId: number;

  @ManyToOne(()=> Vehicle , (vehicle)=> vehicle.journeys)
  // @JoinColumn()
  vehicle: Vehicle;

  // @ManyToOne(() => Vehicle, (vehicle) => vehicle.journeys)
  // vehicle: Vehicle;

  @OneToMany(() => Shipment, (shipments) => shipments.journey, {
    onDelete: 'SET NULL',
  })
  shipments: Shipment[];


  @ManyToOne(()=> User , (accountant)=> accountant.edited_journeys)
  accountant : User;

  // change to old vehicle  add naming to dropped journeys
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.changedJourneys, {
    onDelete: 'SET NULL',
  })
  oldVehicle: Vehicle;

  @OneToOne(()=> Report , (report)=> report.journey, {onDelete: 'SET NULL', onUpdate:'CASCADE'})
  report: Report;


  //THis IS Vehcile Type .. 
  @ManyToOne(() => VehicleType, (type) => type.journeys, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  type: VehicleType;

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
