import { Router } from 'express';
import { TradingPairController } from './controllers/TradingPairController';

const router = Router();
const controller = new TradingPairController();

/**
 * Trading Pair Routes
 *
 * All business logic is handled in the controller and service layers.
 * Routes only define the HTTP endpoints and map them to controller methods.
 */

// CRUD Operations
router.post('/trading-pairs', controller.create);
router.get('/trading-pairs', controller.findAll);
router.get('/trading-pairs/:id', controller.findById);
router.put('/trading-pairs/:id', controller.update);
router.delete('/trading-pairs/:id', controller.delete);

export default router;
