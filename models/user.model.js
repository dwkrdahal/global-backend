import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// profile schema
const profileSchema = new Schema(
  {
    fullName: String,
    contactNumber: String,
    address: String,
    avatar: String,
  },
  {
    timestamps: true,
  }
);

//user schema definition
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "project_manager", "architect"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    profile: profileSchema,
  },
  {
    timestamps: true,
  }
);

// Password hashing
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

//json web token generate token function
userSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        userid: this._id.toString(),
        username: this.username,
        role: this.role,
        status: this.status,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//compare password
userSchema.methods.comparePassword = function (password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (error) {
    console.log(error);
  }
};

const User = model("User", userSchema);
export default User;
