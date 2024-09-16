import {Schema, model} from "mongoose";

const serviceSchema = new Schema({
  icon: {
    type: String,
  }, 
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: Boolean, 
    default: true 
  },
  link: {
    type: String
  }
}, {
  timestamps: true
});

const Service = model("Service", serviceSchema);

export default Service;
