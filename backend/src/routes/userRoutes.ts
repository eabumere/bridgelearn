import { Router } from 'express';
import { userController } from '../controllers/userController.js';

const router = Router();

// User management routes
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.post('/', userController.createUser.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.post('/:id/sync', userController.syncUserToMoodle.bind(userController));

export default router;

