const express = require('express');
const router = express.Router();
const Announcement = require('../model/announcement');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new announcement
router.post('/',protect, admin, async (req, res) => {
  const announcement = new Announcement({
    title: req.body.title
  });
  try {
    const newAnnouncement = await announcement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific announcement
router.get('/:id',protect,admin, getAnnouncement, (req, res) => {
  res.json(req.announcement);
});

// Update an announcement
router.patch('/:id',protect,admin, getAnnouncement, async (req, res) => {
  if (req.body.title != null) {
    req.announcement.title = req.body.title;
  }
  try {
    const updatedAnnouncement = await req.announcement.save();
    res.json(updatedAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an announcement
router.delete('/:id',protect,admin, getAnnouncement, async (req, res) => {
  try {
    await Announcement.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted Announcement' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get an announcement by ID
async function getAnnouncement(req, res, next) {
  let announcement;
  try {
    announcement = await Announcement.findById(req.params.id);
    if (announcement == null) {
      return res.status(404).json({ message: 'Cannot find announcement' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  req.announcement = announcement;
  next();
}

module.exports = router;
