import { Schema, model } from "mongoose";

// Schema for year details
const YearSchema = new Schema({
  started: { type: Date },
  expected: { type: Date },
  completion: { type: Date },
});

// Schema for design architect details
const DesignerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    position: String,
  },
  { _id: false }
);

// Schema for images
const ImageSchema = new Schema({
  url: String,
  caption: String,
});

// Main project schema
const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    architectureStyle: { type: String },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    projectType: { type: String, required: true },
    projectStatus: {
      type: String,
      enum: ["planned", "in-progress", "completed", "on-hold", "cancelled"],
      required: true,
    },
    siteArea: {
      value: { type: Number },
      unit: { type: String, default: "sq. ft." },
    },
    builtUpArea: {
      value: { type: Number },
      unit: { type: String, default: "sq. ft." },
    },
    year: { type: YearSchema },
    designer: { type: DesignerSchema },
    images: [ImageSchema],
    mainImage: ImageSchema,
    client: {
      name: { type: String, required: true },
      email: { type: String },
      contact: { type: String, required: true },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Project = model("Project", ProjectSchema);

export default Project;
