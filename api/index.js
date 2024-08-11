const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { protect, admin } = require('../middleware/authMiddleware');

dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

console.log(process.env.MONGO_URI);

// Connect DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => res.send("Express on vercel"));
// Route
// app.use("/user", require("./routes/user"));
const announcementsRouter = require('../routes/announcements');
app.use('/announcements', announcementsRouter);
const newsRouter = require('../routes/news');
app.use('/news', newsRouter);
const userRoutes =require('../routes/user')
app.use('/users', userRoutes);

app.listen(5000, () => console.log("Server is running"));
