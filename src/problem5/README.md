# Trading Pairs API - Problem 5
## LIVE DEMO
### Get List
curl --location 'http://103.74.116.238:4050/api/trading-pairs'
### Create Pair 
curl --location 'http://103.74.116.238:4050/api/trading-pairs' \
--header 'Content-Type: application/json' \
--data '{
  "label": "PEPE/USDT",
  "base_currency": "PEPE",
  "quote_currency": "USDT",
  "price": 50000.00,
  "volume_24h": 1000000.00,
  "change_24h": 2.5
}'

## Quick Start
### Option 1: Docker (Recommended)

```bash
# Navigate to problem5 directory
cd src/problem5

# Start all services (PostgreSQL + API)
docker-compose up -d

# Check logs
docker-compose logs -f api

# Seed database (optional)
npm run seed

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
npm run seed

# Start dev server
npm run dev
```

### Environment Variables

The application automatically loads environment variables in this priority order:
1. **`.env` file** (create from `.env.example`)
2. **System environment variables** (export commands)
3. **Default values** (hardcoded fallbacks)

Create a `.env` file based on `.env.example`:

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env
```

**`.env` file contents:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=trading_pairs_db
DB_SSL=false

# Server Configuration
PORT=3001
NODE_ENV=development
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