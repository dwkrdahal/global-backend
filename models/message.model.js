import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false, // Not required for non-registered users
  },
  senderName: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: false,
  },
  senderPhone : {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: false, // Not required for non-project-related messages
  },
  images: [
    {
      url: String,
      caption: String,
    },
  ],
  files: [
    {
      url: String,
      name: String,
    },
  ],
  isResolved: {
    type: Boolean,
    default: false,
  },
  responses: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      message: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const Message = model("Message", MessageSchema);

export default Message;
