// models/news.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  cloudinary_id: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', NewsSchema);
