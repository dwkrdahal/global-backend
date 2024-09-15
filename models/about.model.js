import { Schema, model } from "mongoose";

const aboutUsSchema = new Schema({
  
  missionStatement: {
    type: String,
    required: true, 
  },
  visionStatement: {
    type: String,
    required: true, 
  },
  history: {
    type: String,
  },
  values: {
    type: [String],
    required: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const About = model("About", aboutUsSchema);

export default About;

