import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Location } from './location.entity';

@Entity()
export class Trip extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({nullable:false})
    price: number;

    @Column({nullable:false})
    code: string;

    @ManyToOne(()=>Location,location=>location.tripsDeparture)
    departure:Location;

    @ManyToOne(()=>Location,location=>location.tripsArrival)
    arrival:Location;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated: Date;
}