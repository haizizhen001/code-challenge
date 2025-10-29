import { Repository } from 'typeorm';
import { TradingPair } from '../entities/TradingPair';
import DatabaseConfig from '../config/database';
import {
  CreateTradingPairDto,
  UpdateTradingPairDto,
  TradingPairFilters,
  PaginatedResponse,
} from '../dto/types';

/**
 * TradingPairService
 *
 * Contains all business logic for trading pair operations.
 * Separated from controllers for better testability and maintainability.
 */
export class TradingPairService {
  private repository: Repository<TradingPair>;

  /**
   * Lazy load repository
   */
  private getRepository(): Repository<TradingPair> {
    if (!this.repository) {
      const dataSource = DatabaseConfig.getDataSource();
      this.repository = dataSource.getRepository(TradingPair);
    }
    return this.repository;
  }

  /**
   * Create a new trading pair
   */
  async create(data: CreateTradingPairDto): Promise<TradingPair> {
    // Check if trading pair already exists
    const existing = await this.getRepository().findOne({
      where: { label: data.label },
    });

    if (existing) {
      throw new Error(`Trading pair with label "${data.label}" already exists`);
    }

    const tradingPair = this.getRepository().create({
      ...data,
      is_active: true,
    });

    return await this.getRepository().save(tradingPair);
  }

  /**
   * Get all trading pairs with filters and pagination
   */
  async findAll(filters: TradingPairFilters): Promise<PaginatedResponse<TradingPair>> {
    const {
      base_currency,
      quote_currency,
      is_active,
      limit = 50,
      offset = 0,
    } = filters;

    const queryBuilder = this.getRepository().createQueryBuilder('tp');

    // Apply filters
    if (base_currency) {
      queryBuilder.andWhere('tp.base_currency = :base_currency', { base_currency });
    }

    if (quote_currency) {
      queryBuilder.andWhere('tp.quote_currency = :quote_currency', { quote_currency });
    }

    if (is_active !== undefined) {
      queryBuilder.andWhere('tp.is_active = :is_active', { is_active });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const items = await queryBuilder
      .orderBy('tp.created_at', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return {
      items,
      total,
      limit,
      offset,
      hasMore: offset + items.length < total,
    };
  }

  /**
   * Get a single trading pair by ID
   */
  async findById(id: string): Promise<TradingPair> {
    const tradingPair = await this.getRepository().findOne({
      where: { id },
    });

    if (!tradingPair) {
      throw new Error(`Trading pair with ID ${id} not found`);
    }

    return tradingPair;
  }

  /**
   * Update a trading pair
   */
  async update(id: string, data: UpdateTradingPairDto): Promise<TradingPair> {
    const tradingPair = await this.findById(id);

    // Check if label is being changed and if it already exists
    if (data.label && data.label !== tradingPair.label) {
      const existing = await this.getRepository().findOne({
        where: { label: data.label },
      });

      if (existing) {
        throw new Error(`Trading pair with label "${data.label}" already exists`);
      }
    }

    // Update fields
    Object.assign(tradingPair, data);

    return await this.getRepository().save(tradingPair);
  }

  /**
   * Delete a trading pair
   */
  async delete(id: string): Promise<void> {
    const tradingPair = await this.findById(id);
    await this.getRepository().remove(tradingPair);
  }

  /**
   * Get trading pairs by base currency
   */
  async findByBaseCurrency(baseCurrency: string): Promise<TradingPair[]> {
    return await this.getRepository().find({
      where: { base_currency: baseCurrency, is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Get trading pairs by quote currency
   */
  async findByQuoteCurrency(quoteCurrency: string): Promise<TradingPair[]> {
    return await this.getRepository().find({
      where: { quote_currency: quoteCurrency, is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Bulk update prices (useful for price updates from external APIs)
   */
  async bulkUpdatePrices(
    updates: Array<{ label: string; price: number; volume_24h?: number; change_24h?: number }>
  ): Promise<number> {
    let updatedCount = 0;

    for (const update of updates) {
      try {
        const tradingPair = await this.getRepository().findOne({
          where: { label: update.label },
        });

        if (tradingPair) {
          tradingPair.price = update.price;
          if (update.volume_24h !== undefined) {
            tradingPair.volume_24h = update.volume_24h;
          }
          if (update.change_24h !== undefined) {
            tradingPair.change_24h = update.change_24h;
          }
          await this.getRepository().save(tradingPair);
          updatedCount++;
        }
      } catch (error) {
        console.error(`Failed to update ${update.label}:`, error);
      }
    }

    return updatedCount;
  }
}
