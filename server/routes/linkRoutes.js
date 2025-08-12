// server/routes/linkRoutes.js

import express from 'express';
import {
  createLink,
  getLinks,
  updateLink,
  deleteLink,
  reorderLinks,
} from '../controllers/linkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This new route was causing the error
router.put('/reorder', protect, reorderLinks);

router.route('/').post(protect, createLink).get(protect, getLinks);

router
  .route('/:id')
  .put(protect, updateLink)
  .delete(protect, deleteLink);

export default router;