/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { BaseEntity, Column, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { Shipment } from './shipment.entity';

// @Entity()
// export class ShipmentType extends BaseEntity {

//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ nullable: false })
//     type: string;

//     @Column({ nullable: false })
//     @Generated("uuid")
//     sabado:string;

//     @OneToMany(() => Shipment, shipment => shipment.type,{onDelete:'SET NULL'})
//     shipments: Shipment[];
// }
