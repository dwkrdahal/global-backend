import mongoose from "mongoose";

// Schema for images
const imageSchema = new mongoose.Schema({
  url: String,
  caption: String,
});

const clientLogoSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  image: imageSchema,
  link: {
    type: String,
    required: false,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const ClientLogo = mongoose.model('ClientLogo', clientLogoSchema);

export default ClientLogo;
