import { Schema, model } from "mongoose";

// Schema for images
const imageSchema = new Schema({
  url: String,
  caption: String,
});

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: imageSchema,
  cover:imageSchema,
  socialLinks: {
    linkedin: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
  },
}, {
  timestamps: true
});

const Team = model("Team", teamSchema);
export default Team;
