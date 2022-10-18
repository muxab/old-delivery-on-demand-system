/* eslint-disable prettier/prettier */
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, Generated, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from './company.entity';
// import { Journey } from './journey.entity';

@Entity()
export class CompanyType extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    type: string;

    @OneToMany(()=> Company,company=>company.type)
    companies: Company[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated: Date;

}