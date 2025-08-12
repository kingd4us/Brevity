// server/models/SocialLink.js
import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  url: {
    type: String,
    required: true,
  },
  iconName: { // e.g., "FaGithub", "FaTwitter"
    type: String,
    required: true,
  },
});

const SocialLink = mongoose.model('SocialLink', socialLinkSchema);
export default SocialLink;