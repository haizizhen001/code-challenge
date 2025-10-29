/**
 * Data Transfer Objects (DTOs) and Types
 */

export interface CreateTradingPairDto {
  label: string;
  base_currency: string;
  quote_currency: string;
  price?: number;
  volume_24h?: number;
  change_24h?: number;
}

export interface UpdateTradingPairDto {
  label?: string;
  base_currency?: string;
  quote_currency?: string;
  price?: number;
  volume_24h?: number;
  change_24h?: number;
  is_active?: boolean;
}

export interface TradingPairFilters {
  base_currency?: string;
  quote_currency?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
