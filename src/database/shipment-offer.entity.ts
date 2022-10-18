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
import { Shipment } from './shipment.entity';
import { User } from './user.entity';
import { VehicleType } from './vehicle-type.entity';
import { Vehicle } from './vehicle.entity';

@Entity('shipment_offers')
export class ShipmentOffer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: false })
  track_no: string;

  @Column({nullable: false})
  amount : number;


  @Column({nullable: false , default: false})
  read : boolean;


  @Column({nullable: false , default: false})
  rejected : boolean;


  @Column({nullable: false , default: false})
  accepted : boolean;
  //  ---------------------------

 

  @ManyToOne(() => Location, (location) => location.arrivals)
  destination: Location;

  @ManyToOne(() => Location, (location) => location.departures)
  origin: Location;



  // cancelation ShipmentType -- add vehicle type instead
  @Column({nullable: false})
  vehicleId : number;
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.offers)
  vehicle: Vehicle;

  @Column({nullable: false})
  shipmentId : number;
  @ManyToOne(() => Shipment, (shipment) => shipment.offers , {onDelete : 'CASCADE'})
  shipment: Shipment;


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
