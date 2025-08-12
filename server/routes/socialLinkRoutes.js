// server/routes/socialLinkRoutes.js
import express from 'express';
import { getSocialLinks, createSocialLink, deleteSocialLink, updateSocialLink} from '../controllers/socialLinkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getSocialLinks)
  .post(protect, createSocialLink);

router.route('/:id')
.delete(protect, deleteSocialLink)
.put(protect, updateSocialLink);

export default router;