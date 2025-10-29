# Trading Pairs API - Problem 5
## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (recommended)
- OR PostgreSQL 15+ installed locally

### Option 1: Docker (Recommended)

```bash
# Navigate to problem5 directory
cd src/problem5

# Start all services (PostgreSQL + API)
docker-compose up -d

# Check logs
docker-compose logs -f api

# Seed database (optional)
npm run seed:problem5

# Stop services
docker-compose down
```

Server: `http://localhost:3001`

### Option 2: Local Development

```bash
# Navigate to problem5 directory
cd src/problem5

# Start PostgreSQL only
docker-compose up -d postgres

# Install dependencies
npm install

# Seed database (optional)
npm run seed:problem5

# Start dev server
npm run dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=trading_pairs_db
DB_SSL=false
```

## API Documentation

Base URL: `http://localhost:3001/api`

### Endpoints

#### 1. Health Check
```http
GET /health

Response (200 OK):
{
  "success": true,
  "message": "Trading Pairs API is running (PostgreSQL + TypeORM)",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "database": "connected"
}
```

#### 2. Create Trading Pair
```http
POST /api/trading-pairs
Content-Type: application/json

{
  "label": "BTC/USDT",
  "base_currency": "BTC",
  "quote_currency": "USDT",
  "price": 50000.00,
  "volume_24h": 1000000.00,
  "change_24h": 2.5
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "label": "BTC/USDT",
    "base_currency": "BTC",
    "quote_currency": "USDT",
    "price": 50000.00,
    "volume_24h": 1000000.00,
    "change_24h": 2.5,
    "is_active": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  },
  "message": "Trading pair created successfully"
}
```

**Required fields:** `label`, `base_currency`, `quote_currency`
**Optional fields:** `price`, `volume_24h`, `change_24h`

#### 3. Get All Trading Pairs (with filters)
```http
GET /api/trading-pairs?base_currency=BTC&is_active=true&limit=10&offset=0

Response (200 OK):
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "label": "BTC/USDT",
        "base_currency": "BTC",
        "quote_currency": "USDT",
        "price": 50000.00,
        "volume_24h": 1000000.00,
        "change_24h": 2.5,
        "is_active": true,
        "created_at": "2024-01-15T10:00:00.000Z",
        "updated_at": "2024-01-15T10:00:00.000Z"
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

**Query Parameters:**
- `base_currency` (optional): Filter by base currency
- `quote_currency` (optional): Filter by quote currency
- `is_active` (optional): Filter by active status (true/false)
- `limit` (optional): Number of items per page (default: 50)
- `offset` (optional): Number of items to skip (default: 0)

#### 4. Get Trading Pair by ID
```http
GET /api/trading-pairs/{id}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "label": "BTC/USDT",
    "base_currency": "BTC",
    "quote_currency": "USDT",
    "price": 50000.00,
    "volume_24h": 1000000.00,
    "change_24h": 2.5,
    "is_active": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}

Response (404 Not Found):
{
  "success": false,
  "error": "Trading pair with ID {id} not found"
}
```

#### 5. Update Trading Pair
```http
PUT /api/trading-pairs/{id}
Content-Type: application/json

{
  "price": 51000.00,
  "volume_24h": 1100000.00,
  "change_24h": 3.2
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "label": "BTC/USDT",
    "base_currency": "BTC",
    "quote_currency": "USDT",
    "price": 51000.00,
    "volume_24h": 1100000.00,
    "change_24h": 3.2,
    "is_active": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:05:00.000Z"
  },
  "message": "Trading pair updated successfully"
}
```

**All fields are optional** - only provide the fields you want to update.

#### 6. Delete Trading Pair
```http
DELETE /api/trading-pairs/{id}

Response (200 OK):
{
  "success": true,
  "message": "Trading pair deleted successfully"
}

Response (404 Not Found):
{
  "success": false,
  "error": "Trading pair with ID {id} not found"
}
```

### Example Usage with cURL

```bash
# Create a new trading pair
curl -X POST http://localhost:3001/api/trading-pairs \
  -H "Content-Type: application/json" \
  -d '{
    "label": "ETH/USDT",
    "base_currency": "ETH",
    "quote_currency": "USDT",
    "price": 3000.00
  }'

# Get all trading pairs
curl http://localhost:3001/api/trading-pairs

# Get specific trading pair
curl http://localhost:3001/api/trading-pairs/{id}

# Update trading pair
curl -X PUT http://localhost:3001/api/trading-pairs/{id} \
  -H "Content-Type: application/json" \
  -d '{"price": 3100.00}'

# Delete trading pair
curl -X DELETE http://localhost:3001/api/trading-pairs/{id}
```

## Project Structure

```
src/problem5/
├── config/
│   └── database.ts          # Database configuration
├── controllers/
│   └── TradingPairController.ts  # HTTP request handlers
├── dto/
│   └── types.ts             # TypeScript interfaces & DTOs
├── entities/
│   └── TradingPair.ts       # TypeORM entity
├── initDatabase/
│   └── seed.ts              # Database seeding script
├── services/
│   └── TradingPairService.ts     # Business logic
├── routes.ts                # API routes
├── server.ts                # Application entry point
├── Dockerfile               # Docker image configuration
├── docker-compose.yml       # Docker services orchestration
└── package.json             # Dependencies and scripts
```

## Architecture

- **Controller-Service Pattern**: Separation of HTTP handling and business logic
- **TypeORM**: Type-safe database operations with decorators
- **DTOs**: Validated data transfer objects
- **Repository Pattern**: Database abstraction layer

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate entries)
- `500` - Internal Server Error

## Development

```bash
# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Seed database
npm run seed:problem5
```

## Testing

```bash
# Run tests (not implemented yet)
npm test
```

## Docker Commands

```bash
# Build and start containers
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop containers
docker-compose down

# Remove volumes (cleans database)
docker-compose down -v

# Rebuild API container
docker-compose up -d --build api
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **TypeORM** - ORM for database operations
- **PostgreSQL** - Relational database
- **Docker** - Containerization
- **CORS** - Cross-origin resource sharing
