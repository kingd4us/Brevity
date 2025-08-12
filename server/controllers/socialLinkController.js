// server/controllers/socialLinkController.js
import SocialLink from '../models/SocialLink.js';

// Get all social links for a user
export const getSocialLinks = async (req, res) => {
  const socialLinks = await SocialLink.find({ user: req.user._id });
  res.json(socialLinks);
};

// Create a social link
export const createSocialLink = async (req, res) => {
  const { url, iconName } = req.body;
  const socialLink = new SocialLink({ url, iconName, user: req.user._id });
  const createdLink = await socialLink.save();
  res.status(201).json(createdLink);
};

// Delete a social link
export const deleteSocialLink = async (req, res) => {
  const link = await SocialLink.findById(req.params.id);
  if (link && link.user.toString() === req.user._id.toString()) {
    await link.deleteOne();
    res.json({ message: 'Social link removed' });
  } else {
    res.status(404).json({ message: 'Link not found or not authorized' });
  }
};

export const updateSocialLink = async (req, res) => {
    const { url, iconName } = req.body;
    const link = await SocialLink.findById(req.params.id);
  
    if (link && link.user.toString() === req.user._id.toString()) {
      link.url = url || link.url;
      link.iconName = iconName || link.iconName;
      const updatedLink = await link.save();
      res.json(updatedLink);
    } else {
      res.status(404).json({ message: 'Link not found or not authorized' });
    }
  };