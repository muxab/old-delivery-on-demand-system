import { InvoiceType } from 'src/utils/enums/invoice-type.enum';
import { ShipmentPayment } from 'src/utils/enums/spayment.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';
import { User } from './user.entity';


@Entity('invoices')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false})
  uuid: string;

  @Column({nullable: true})
  amount : number ;

  @Column({ type: 'enum', enum: InvoiceType, default: InvoiceType.CHEQUE })
  type : InvoiceType;

  @Column({nullable: true})
  ref_no : string;
  
  @ManyToOne(()=> Shipment , (shipment)=> shipment.invoices)
  shipment : Shipment;

  @Column({ type: 'enum', enum: ShipmentPayment, default: ShipmentPayment.NEW })
  status: ShipmentPayment;


  @ManyToOne(()=> User ,(user)=> user.invoices)
  client : User;


  @ManyToOne(()=> User ,(user)=> user.invoices_editing)
  accountant : User;

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