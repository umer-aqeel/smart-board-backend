const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const News = require('../model/news');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a new news item
router.post("/",protect, admin, upload.single("image"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new news item
    let news = new News({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      image: result.secure_url,
      cloudinary_id: result.public_id
    });
    // Save news item
    await news.save();
    res.json(news);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Get all news items
router.get("/", async (req, res) => {
  try {
    let news = await News.find();
    res.json(news);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Get a specific news item
router.get("/:id",protect, admin, async (req, res) => {
  try {
    let news = await News.findById(req.params.id);
    if (news == null) {
      return res.status(404).json({ message: 'Cannot find news item' });
    }
    res.json(news);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Update a news item
router.put("/:id",protect, admin, upload.single("image"), async (req, res) => {
  try {
    let news = await News.findById(req.params.id);
    if (news == null) {
      return res.status(404).json({ message: 'Cannot find news item' });
    }

    // Delete image from cloudinary if a new one is uploaded
    if (req.file) {
      await cloudinary.uploader.destroy(news.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.image = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }

    const data = {
      title: req.body.title || news.title,
      description: req.body.description || news.description,
      date: req.body.date || news.date,
      image: req.body.image || news.image,
      cloudinary_id: req.body.cloudinary_id || news.cloudinary_id
    };

    news = await News.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(news);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Delete a news item
router.delete("/:id",protect, admin, async (req, res) => {
  try {
    let news = await News.findById(req.params.id);
    if (news == null) {
      return res.status(404).json({ message: 'Cannot find news item' });
    }
    await cloudinary.uploader.destroy(news.cloudinary_id);
    await News.deleteOne({ _id: req.params.id });
    res.json({ message: 'News item deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;


// // routes/news.js
// const express = require('express');
// const router = express.Router();
// const cloudinary = require('../utils/cloudinary');
// const upload = require('../utils/multer');
// const News = require('../model/news');

// // Create a new news item
// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     // Upload image to cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);

//     // Create new news item
//     let news = new News({
//       title: req.body.title,
//       description: req.body.description,
//       date: req.body.date,
//       image: result.secure_url,
//       cloudinary_id: result.public_id
//     });
//     // Save news item
//     await news.save();
//     res.json(news);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err.message);
//   }
// });

// // Get all news items
// router.get("/", async (req, res) => {
//   try {
//     let news = await News.find();
//     res.json(news);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err.message);
//   }
// });

// // Get a specific news item
// router.get("/:id", async (req, res) => {
//   try {
//     let news = await News.findById(req.params.id);
//     res.json(news);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err.message);
//   }
// });

// // Update a news item
// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     let news = await News.findById(req.params.id);

//     // Delete image from cloudinary if a new one is uploaded
//     if (req.file) {
//       await cloudinary.uploader.destroy(news.cloudinary_id);
//       const result = await cloudinary.uploader.upload(req.file.path);
//       req.body.image = result.secure_url;
//       req.body.cloudinary_id = result.public_id;
//     }

//     const data = {
//       title: req.body.title || news.title,
//       description: req.body.description || news.description,
//       date: req.body.date || news.date,
//       image: req.body.image || news.image,
//       cloudinary_id: req.body.cloudinary_id || news.cloudinary_id
//     };

//     news = await News.findByIdAndUpdate(req.params.id, data, { new: true });
//     res.json(news);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err.message);
//   }
// });

// // Delete a news item
// router.delete("/:id", async (req, res) => {
//   try {
//     let news = await News.findById(req.params.id);
//     await cloudinary.uploader.destroy(news.cloudinary_id);
//     await news.remove();
//     res.json({ message: 'News item deleted' });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err.message);
//   }
// });

// module.exports = router;
