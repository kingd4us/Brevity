// server/routes/userRoutes.js
import express from 'express';
import {    registerUser,
            loginUser,
            getUserProfile, getUserLinks,updateUserProfile 
        } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; //import our bouncer

const router = express.Router();

// When a POST request is made to '/register', call the registerUser function
router 
        .get('/:username/links', getUserLinks)
        .post('/register', registerUser)
        .post('/login', loginUser)
        .get('/profile', protect, getUserProfile);
export default router;