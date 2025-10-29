import { Request, Response } from 'express';
import { TradingPairService } from '../services/TradingPairService';
import { ApiResponse } from '../dto/types';

/**
 * TradingPairController
 *
 * Handles HTTP requests and responses.
 * Delegates business logic to TradingPairService.
 * Follows Controller-Service pattern for separation of concerns.
 */
export class TradingPairController {
  private service: TradingPairService;

  constructor() {
    this.service = new TradingPairService();
  }

  /**
   * CREATE - Create a new trading pair
   * POST /api/trading-pairs
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { label, base_currency, quote_currency, price, volume_24h, change_24h } = req.body;

      // Validation
      if (!label || !base_currency || !quote_currency) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: label, base_currency, quote_currency',
        } as ApiResponse<null>);
        return;
      }

      const tradingPair = await this.service.create({
        label,
        base_currency,
        quote_currency,
        price,
        volume_24h,
        change_24h,
      });

      res.status(201).json({
        success: true,
        data: tradingPair,
        message: 'Trading pair created successfully',
      } as ApiResponse<typeof tradingPair>);
    } catch (error: any) {
      console.error('Error creating trading pair:', error);
      const statusCode = error.message.includes('already exists') ? 409 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to create trading pair',
      } as ApiResponse<null>);
    }
  };

  /**
   * LIST - Get all trading pairs with filters
   * GET /api/trading-pairs
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        base_currency,
        quote_currency,
        is_active,
        limit = '50',
        offset = '0',
      } = req.query;

      const filters = {
        base_currency: base_currency as string | undefined,
        quote_currency: quote_currency as string | undefined,
        is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
      };

      const result = await this.service.findAll(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Error fetching trading pairs:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch trading pairs',
      } as ApiResponse<null>);
    }
  };

  /**
   * GET - Get a single trading pair by ID
   * GET /api/trading-pairs/:id
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const tradingPair = await this.service.findById(id);

      res.json({
        success: true,
        data: tradingPair,
      } as ApiResponse<typeof tradingPair>);
    } catch (error: any) {
      console.error('Error fetching trading pair:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch trading pair',
      } as ApiResponse<null>);
    }
  };

  /**
   * UPDATE - Update a trading pair
   * PUT /api/trading-pairs/:id
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if there are fields to update
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          error: 'No fields to update',
        } as ApiResponse<null>);
        return;
      }

      const tradingPair = await this.service.update(id, updateData);

      res.json({
        success: true,
        data: tradingPair,
        message: 'Trading pair updated successfully',
      } as ApiResponse<typeof tradingPair>);
    } catch (error: any) {
      console.error('Error updating trading pair:', error);
      let statusCode = 500;
      if (error.message.includes('not found')) statusCode = 404;
      if (error.message.includes('already exists')) statusCode = 409;

      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to update trading pair',
      } as ApiResponse<null>);
    }
  };

  /**
   * DELETE - Delete a trading pair
   * DELETE /api/trading-pairs/:id
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.delete(id);

      res.json({
        success: true,
        message: 'Trading pair deleted successfully',
      } as ApiResponse<null>);
    } catch (error: any) {
      console.error('Error deleting trading pair:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to delete trading pair',
      } as ApiResponse<null>);
    }
  };
}
