import { Router } from 'express';
import {
  createUser,
  createUsersBatch,
  deleteUser,
  getUser,
  listUsers,
  updateUser
} from "../controllers/users.controller.js";

const router = Router();

router.post('/', createUser);
router.post('/batch', createUsersBatch);
router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;