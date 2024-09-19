import mongoose from "mongoose";

// Schema for images
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String },
});

// Schema for videos
const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String },
});

const bannerSchema = new mongoose.Schema(
  {
    image: imageSchema,
    video: videoSchema,
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    media: {
      type: String,
      enum: ["image", "video"],
      required: true,
      default: "image", // Default media type
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
