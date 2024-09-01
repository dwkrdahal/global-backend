import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: ""
  },
  addPlus: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rank: {
    type: Number,
    default: 10,
  }
},
{
  timestamps: true
});

const Feature = mongoose.model("Feature", featureSchema);
export default Feature;
