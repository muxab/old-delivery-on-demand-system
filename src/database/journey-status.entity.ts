import { BaseEntity, Column, Entity, Generated, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Journey } from './journey.entity';
import { Location } from './location.entity';
import { Shipment } from './shipment.entity';
import { VehicleType } from './vehicle-type.entity';
import { Vehicle } from './vehicle.entity';
// import { Journey } from './journey.entity';

@Entity()
export class JourneyStatus extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable:false})
    status: string;
    @OneToMany(()=>Journey,journey=>journey.status)
    journeys: Journey[];

}