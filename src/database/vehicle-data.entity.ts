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
import { Report } from './report.entity';
import { ShipmentOffer } from './shipment-offer.entity';
import { User } from './user.entity';
import { VehicleType } from './vehicle-type.entity';
import { Vehicle } from './vehicle.entity';
// import { Journey } from './journey.entity';

@Entity('vehicles_data')
export class VehicleData extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  // official Vehicle Data

  @Column({ unique: true })
  license_no: string;

  @Column({ unique: true })
  plate_no: string;

  @Column({ nullable: false })
  type_txt: string;


  @Column({ nullable: false })
  sideImg: string;
  @Column({ nullable: false })
  plateImg: string;
  @Column({ nullable: false })
  cerImg: string;


  @OneToOne(()=> Vehicle , (vehicle) => vehicle.data)
  @JoinColumn()
  vehicle : Vehicle;


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated: Date;


  @OneToMany(()=> ShipmentOffer, (offers)=> offers.vehicle)
    offers: ShipmentOffer[];
}
