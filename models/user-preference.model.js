import {Schema, model} from "mongoose";

const UserPreferenceSchema = new Schema ({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  preferences: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light"
    },
    language: {
      type: String,
      default: "en"
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  settings: {
    emailNotification: {
      type: Boolean,
      default: true
    },
    smsNotification: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

const UserPreference = model('UserPreference', UserPreferenceSchema)
export default UserPreference;