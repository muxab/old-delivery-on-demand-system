/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Journey } from './journey.entity';
import { Trip } from './trip.entity';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Location extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    city: string;
    
    @Column({ nullable: true })
    city_en: string;

    @Column({nullable:true})
    code:string;


    @Column({nullable:true})
    latitiude:string;
    @Column({nullable:true})
    longitude:string;

    
    @OneToMany(() => Journey, journey => journey.origin)
    departures: Journey[];
    @OneToMany(() => Journey, journey => journey.destination)
    arrivals: Journey[];

    @OneToMany(()=>Trip,trip=>trip.departure)
    tripsDeparture:Trip[];
    @OneToMany(()=>Trip,trip=>trip.arrival)
    tripsArrival:Trip[];

    @OneToMany(()=> Vehicle , (vehicles)=> vehicles.currentLocation)
    vehicles : Vehicle[];
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated: Date;
}
