import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import DatabaseConfig from './config/database';
import routes from './routes';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Trading Pairs API is running (PostgreSQL + TypeORM)',
    timestamp: new Date().toISOString(),
    database: 'connected',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

/**
 * Start server with database connection
 */
async function startServer() {
  try {
    // Initialize database connection
    await DatabaseConfig.connect();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║   Trading Pairs API Server Started (Problem 5)    ║
╠════════════════════════════════════════════════════╣
║  Port: ${PORT}                                    ║
║  Database: PostgreSQL + TypeORM                    ║
║  Architecture: Controller-Service Pattern          ║
║  Environment: ${process.env.NODE_ENV || 'development'}                   ║
║  Time: ${new Date().toLocaleString()}              ║
╚════════════════════════════════════════════════════╝

Available endpoints:
  GET    /health
  GET    /api/trading-pairs
  GET    /api/trading-pairs/:id
  POST   /api/trading-pairs
  PUT    /api/trading-pairs/:id
  DELETE /api/trading-pairs/:id
  POST   /api/trading-pairs/bulk-update
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await DatabaseConfig.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await DatabaseConfig.disconnect();
  process.exit(0);
});

// Start the server
startServer();

export default app;
