import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listActiveProducts,
  listProducts
} from "../controllers/products.controller.js";

const router = Router();

router.post('/', createProduct);
router.get('/', listProducts);
router.get('/actives', listActiveProducts);
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);

export default router;