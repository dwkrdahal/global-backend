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
    required: true, 
  },
  team: [
    {
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
        required: true, 
      },
      avatar: {
        type: String,
        required: false, 
      },
    },
  ],
  values: {
    type: [String],
    required: true, 
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

