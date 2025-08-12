// server/controllers/linkController.js

import Link from '../models/Link.js';

// @desc    Create a new link
// @route   POST /api/links
// @access  Private
const createLink = async (req, res) => {
  const { title, url } = req.body;
  try {
    // Find how many links the user already has to determine the new position
    const linkCount = await Link.countDocuments({ user: req.user._id });

    const link = await Link.create({
      title,
      url,
      user: req.user._id,
      position: linkCount, // Assign the new position
    });
    res.status(201).json(link);
  } catch (error) {
    res.status(400).json({ message: 'Could not create link' });
  }
};

const getLinks = async (req, res) => {
  try {
    // Find all links where the 'user' field matches the logged-in user's ID
    const links = await Link.find({ user: req.user._id });
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateLink = async (req, res) => {
  const { title, url } = req.body;

  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Authorization Check: Ensure the link belongs to the logged-in user
    if (link.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    link.title = title || link.title; // Update title if provided, otherwise keep old title
    link.url = url || link.url; // Update url if provided, otherwise keep old url

    const updatedLink = await link.save();
    res.status(200).json(updatedLink);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a link
// @route   DELETE /api/links/:id
// @access  Private
const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Authorization Check: Same as in updateLink
    if (link.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await link.deleteOne();
    res.status(200).json({ message: 'Link removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
const reorderLinks = async (req, res) => {
  const { orderedLinkIds } = req.body; // Expecting an array of link IDs
  try {
    const promises = orderedLinkIds.map((linkId, index) => {
      return Link.findByIdAndUpdate(linkId, { position: index });
    });
    await Promise.all(promises);
    res.status(200).json({ message: 'Links reordered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Could not reorder links' });
  }
};



// IMPORTANT: Update your exports at the bottom of the file
export { createLink, getLinks, updateLink, deleteLink, reorderLinks };
