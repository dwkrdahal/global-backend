import mongoose from "mongoose";

// Schema for images
const imageSchema = new mongoose.Schema({
  url: String,
  caption: String,
});

const testimonySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: imageSchema,
  position: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  testimony: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Testimony = mongoose.model('Testimony', testimonySchema);

export default Testimony;
