import { report } from 'process';
import { Status } from 'src/utils/enums/vstatus.enum';
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
import { Company } from './company.entity';
import { Journey } from './journey.entity';
import { Location } from './location.entity';
import { Report } from './report.entity';
import { ShipmentOffer } from './shipment-offer.entity';
import { User } from './user.entity';
import { VehicleData } from './vehicle-data.entity';
import { VehicleType } from './vehicle-type.entity';
// import { Journey } from './journey.entity';

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  // official Vehicle Data


  @Column({nullable: false})
  max_load : number;

  @Column({ unique: true })
  liceinse_no: string;

  @Column({ unique: true })
  plate_no: string;

  @Column({ nullable: false })
  type_txt: string;

  @Column({ type: 'enum', enum: Status, default: Status.READY })
  status: Status;


  @Column({nullable : false , default: 0})
  balance : number;


  @OneToOne(() => User, (driver) => driver.vehicle, { onDelete: 'SET NULL' })
  @JoinColumn()
  driver: User;

  @Column({nullable: true})
  typeId : number;
  @ManyToOne(() => VehicleType, (type) => type.vehicles)
  type: VehicleType;

  //company Data
  @Column({nullable: true})
  companyId : number;
  @ManyToOne(() => Company, (company) => company.vehicles)
  company: Company;

  
  @OneToOne(()=> VehicleData , (vehicleData) => vehicleData.vehicle)
  data : VehicleData;

  @OneToOne(() => Journey, (journey) => journey.vehicle)
  @JoinColumn()
  current: Journey;
  
  @Column({nullable:true})
  currentId: number;

  @OneToMany(() => Journey, (journey) => journey.vehicle, {
    onDelete: 'SET NULL',
  })
  journeys: Journey[];

  @OneToMany(() => Journey, (journey) => journey.vehicle, {
    onDelete: 'SET NULL',
  })
  changedJourneys: Journey[];



  @Column()
  currentLocationId : number;
  @ManyToOne(()=> Location , (location)=> location.vehicles, )
  currentLocation : Location;

  @OneToMany(()=> Report , (reports)=> reports.vehicle, {onDelete: 'SET NULL', onUpdate:'CASCADE'})
  reports: Report[];


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated: Date;


  @OneToMany(()=> ShipmentOffer, (offers)=> offers.vehicle)
    offers: ShipmentOffer[];
}
