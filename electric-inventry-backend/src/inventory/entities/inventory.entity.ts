import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntityClass } from '../../shared/base.entity';
import { Branch } from '../../branch/entities/branch.entity';

@Entity('inventories')
@Unique(['productName', 'branchId'])
export class Inventory extends BaseEntityClass {
  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentQuantity: number;

  @Column({ type: 'varchar', length: 50 })
  unit: string; // pieces/boxes/kgs

  @Column({ type: 'int' })
  lowStockThreshold: number;

  @Column({ type: 'varchar', length: 255 })
  brand: string;

  @Column({ type: 'int', nullable: true })
  branchId: number | null;

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branchId' })
  branch: Branch | null;
}
