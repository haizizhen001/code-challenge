import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TradingPair } from '../entities/TradingPair';

/**
 * Database Configuration 
 *
 * This class implements the Singleton pattern to ensure only one database
 * connection exists throughout the application lifecycle.
 */
class DatabaseConfig {
  private static instance: DatabaseConfig;
  private dataSource: DataSource;

  private constructor() {

    const config: DataSourceOptions = {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'trading_pairs_db',
      entities: [TradingPair],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in dev only
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

    // Log configuration source for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Database Configuration:');
      console.log(`   Source: ${process.env.DB_HOST ? 'Environment variable' : 'Default value'}`);
      console.log(`   Host: ${config.host}`);
      console.log(`   Port: ${(config as any).port}`);
      console.log(`   Database: ${config.database}`);
      console.log(`   SSL: ${config.ssl ? 'enabled' : 'disabled'}`);
    }

    this.dataSource = new DataSource(config);
  }

  /**
   * Get singleton instance of DatabaseConfig
   */
  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  /**
   * Initialize database connection
   */
  public async connect(): Promise<DataSource> {
    if (!this.dataSource.isInitialized) {
      try {
        await this.dataSource.initialize();
        console.log('✅ Database connected successfully');
        console.log(`📊 Database: ${this.dataSource.options.database}`);
        console.log(`🔗 Host: ${(this.dataSource.options as any).host}:${(this.dataSource.options as any).port}`);
      } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
      }
    }
    return this.dataSource;
  }

  /**
   * Get DataSource instance
   */
  public getDataSource(): DataSource {
    if (!this.dataSource.isInitialized) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.dataSource;
  }

  /**
   * Close database connection
   */
  public async disconnect(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      console.log('✅ Database disconnected');
    }
  }
}

// Export singleton instance
export default DatabaseConfig.getInstance();
