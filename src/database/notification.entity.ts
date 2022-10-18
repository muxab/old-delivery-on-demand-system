import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    Generated,
} from 'typeorm';
// import * as shortid from 'shortid';
import { User } from './user.entity';
import { NotificationType } from 'src/utils/enums/nType.enum';
import shortid from 'shortid';

@Entity('notifications')
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })

    @Column()
    @Generated('uuid')
    uuid: string;

    @Column()
    message:string;

    @Column()
    extra:string;


    @Column({type:'enum', enum: NotificationType , default: NotificationType.MESSAGE})
    type:NotificationType;
    
    @Column({default:false})
    read: boolean;

    @Column({ nullable: false })
    userId: number;

    @ManyToOne(() => User, user => user.notifications)
    user: User;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    created: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updated: Date;

}