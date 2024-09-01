import { Schema, model } from "mongoose";

// Schema for location details
const LocationSchema = new Schema({
  address: String,
  city: String,
  district: String,
  state: String,
  country: String,
  coordinates: {
    latitude: { type: String },
    longitude: { type: String },
  },
});

// Schema for year details
const YearSchema = new Schema({
  start: { type: Date },
  expected: {type: Date},
  completion: { type: Date },
});

// Schema for contact details
const ContactSchema = new Schema({
  email: String,
  phone: [String],
});

// Schema for design architect details
const DesignArchitectSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
  },
  { _id: false }
);

// Schema for images
const ImageSchema = new Schema({
  url: String,
  caption: String,
});

// Main project schema
const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  architectureStyle: { type: String },
  projectType: {
    type: String,
    enum: ["architecture", "construction", "structure"],
    required: true,
  },
  projectStatus: {
    type: String,
    enum: ["planned", "in-progress", "completed", "on-hold", "cancelled"],
    required: true,
  },
  location: { type: LocationSchema, required: true },
  siteArea: {
    value: { type: Number },
    unit: { type: String },
  },
  builtUpArea: {
    value: { type: Number },
    unit: { type: String },
  },
  year: { type: YearSchema },
  designArchitect: { type: DesignArchitectSchema },
  images: [ImageSchema],
  client: {
    name: { type: String, required: true },
    contact: { type: ContactSchema, required: true },
  },
  materialsUsed: [String],
  sustainabilityFeatures: [String],
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
}, {
  timestamps: true
});

const Project = model("Project", ProjectSchema);

export default Project;
