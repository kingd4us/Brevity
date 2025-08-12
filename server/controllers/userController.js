import User from '../models/User.js';
import Link from '../models/Link.js';
import jwt from 'jsonwebtoken'; //jwt library
import SocialLink from '../models/SocialLink.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// server/controllers/userController.js

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

  } catch (error) {
    // NEW: Detailed validation error handling
    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

  // @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by their email
      const user = await User.findOne({ email });
  
      // Check if the user exists AND if the password matches
      // We use the new matchPassword method we just created
      if (user && (await user.matchPassword(password))) {
        // If everything matches, generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '30d', // The token will be valid for 30 days
        });
  
        // Send back the user's info and the token
        res.status(200).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: token,
        });
      } else {
        // If user doesn't exist or password doesn't match, send an error
        // Note: We send a generic error for security reasons
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

  // @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.bio = req.body.bio || user.bio;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile' });
  }
};

const getUserProfile = async (req, res) => {
    // The user object is attached to the request in our 'protect' middleware
    const user = req.user;

    if (user) {
        res.status(200).json({
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          bio: req.user.bio,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
  
const getUserLinks = async (req, res) => {
  try {
    // First, find the user by their username from the URL parameter
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const links = await Link.find({ user: user._id }).sort({ position: 'asc' });
    const socialLinks = await SocialLink.find({ user: user._id }); // Fetch social links
    const publicProfile = {
        username: user.username,
        bio: user.bio,
        links: links,
        socialLinks: socialLinks, // Add them to the response
    };
    res.status(200).json(publicProfile);
} catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// IMPORTANT: Add the new function to your exports at the bottom!
export { registerUser, loginUser, getUserProfile, getUserLinks, updateUserProfile };