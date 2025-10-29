import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * TradingPair Entity
 *
 * Represents a cryptocurrency trading pair (e.g., BNB/USDT, ETH/USDT)
 * Uses TypeORM decorators for database mapping
 */
@Entity('trading_pairs')
export class TradingPair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @Index()
  label: string;

  @Column({ type: 'varchar', length: 10 })
  @Index()
  base_currency!: string;

  @Column({ type: 'varchar', length: 10 })
  @Index()
  quote_currency!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  price?: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  volume_24h?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  change_24h?: number;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
