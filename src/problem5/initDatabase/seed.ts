import 'reflect-metadata';
import DatabaseConfig from '../config/database';
import { TradingPair } from '../entities/TradingPair';

/**
 * Seed script to populate initial trading pairs data for PostgreSQL
 * Run with: npm run seed:problem5
 */

const seedData = [
  {
    label: 'BNB/USDT',
    base_currency: 'BNB',
    quote_currency: 'USDT',
    price: 612.50,
    volume_24h: 1234567.89,
    change_24h: 2.35,
    is_active: true,
  },
  {
    label: 'ETH/USDT',
    base_currency: 'ETH',
    quote_currency: 'USDT',
    price: 3456.78,
    volume_24h: 9876543.21,
    change_24h: -1.24,
    is_active: true,
  },
  {
    label: 'SOL/USDT',
    base_currency: 'SOL',
    quote_currency: 'USDT',
    price: 145.67,
    volume_24h: 543210.98,
    change_24h: 5.67,
    is_active: true,
  },
  {
    label: 'BTC/USDT',
    base_currency: 'BTC',
    quote_currency: 'USDT',
    price: 67890.12,
    volume_24h: 12345678.90,
    change_24h: 0.89,
    is_active: true,
  },
  {
    label: 'ADA/USDT',
    base_currency: 'ADA',
    quote_currency: 'USDT',
    price: 0.65,
    volume_24h: 234567.89,
    change_24h: -0.45,
    is_active: true,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding for Problem 5 (PostgreSQL)...\n');

  try {
    // Connect to database
    const dataSource = await DatabaseConfig.connect();
    const repository = dataSource.getRepository(TradingPair);

    // Clear existing data
    console.log('🗑️  Clearing existing records...');
    await repository.clear();  // This is the proper way to clear all records
    console.log('🗑️  All existing records cleared\n');

    // Insert seed data
    let insertCount = 0;
    for (const data of seedData) {
      const tradingPair = repository.create(data);
      const saved = await repository.save(tradingPair);
      insertCount++;
      console.log(`✅ Created: ${saved.label} (ID: ${saved.id})`);
    }

    console.log(`\n🎉 Successfully seeded ${insertCount} trading pairs!`);
    console.log('\n📊 Current data:');

    // Display seeded data
    const all = await repository.find({
      order: { id: 'ASC' },
    });

    console.table(
      all.map((tp) => ({
        id: tp.id,
        label: tp.label,
        base_currency: tp.base_currency,
        quote_currency: tp.quote_currency,
        price: tp.price,
        change_24h: tp.change_24h,
      }))
    );

    console.log('\n✅ Seeding completed successfully!');
  } catch (error: any) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await DatabaseConfig.disconnect();
    process.exit(0);
  }
}

// Run seed function
seedDatabase();
