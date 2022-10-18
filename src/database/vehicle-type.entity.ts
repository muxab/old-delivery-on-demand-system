import {
    BaseEntity,
    Column,
    Entity,
    Generated,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Journey } from './journey.entity';
import { Shipment } from './shipment.entity';
import { Vehicle } from './vehicle.entity';
// import { Journey } from './journey.entity';

@Entity()
export class VehicleType extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false })
    type_ar: string;

    // @Column({ nullable: false })
    // image: string;

    @OneToMany(()=>Vehicle ,vehicle=>vehicle.type)
    vehicles : Vehicle[];

    @OneToMany(()=>Journey,journey=>journey.type)
    journeys: Journey[];

    @OneToMany(()=>Shipment,shipment=>shipment.type)
    shipments:Shipment[];
}
