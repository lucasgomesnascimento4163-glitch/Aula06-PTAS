import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listActiveProducts,
  listProducts
} from "../controllers/products.controller.js";
import { valida } from '../middlewares/valida.js';
import { productSchema, updateProductSchema } from '../schemas/product.schema.js';

const router = Router();

router.post('/', valida(productSchema), createProduct);
router.put('/:id', valida(updateProductSchema), updateProduct);
router.get('/', listProducts);
router.get('/actives', listActiveProducts);
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);

export default router;