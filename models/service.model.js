import {Schema, model} from "mongoose";

// Schema for images
const imageSchema = new Schema({
  url: String,
  caption: String,
});

const serviceSchema = new Schema({
  image: imageSchema, 
  icon: imageSchema, 
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  status: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

const Service = model("Service", serviceSchema);

export default Service;
