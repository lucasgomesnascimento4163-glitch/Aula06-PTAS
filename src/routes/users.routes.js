import { Router } from 'express';
import {
  createUser,
  createUsersBatch,
  deleteUser,
  getUser,
  listUsers,
  updateUser
} from "../controllers/users.controller.js";
import { valida } from '../middlewares/valida.js';
import { userSchema, updateUserSchema } from '../schemas/user.schema.js';

const router = Router();

router.post('/', valida(userSchema), createUser);
router.post('/batch', valida(createUsersBatch));
router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', valida(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;