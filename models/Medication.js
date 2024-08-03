const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likedAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: String,
  commentedAt: { type: Date, default: Date.now },
});

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  likes: [likeSchema],
  comments: [commentSchema],
  quantity: { type: Number, required: true },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Medication", medicationSchema);
