import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["viewer", "admin", "staff"],
      default: "staff",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Used to invalidate old JWT sessions
    // after the password has been changed.
    passwordChangedAt: {
      type: Date,
      default: null,
    },

    // Hashed password-reset token.
    // Never store the original reset token.
    passwordResetToken: {
      type: String,
      default: null,
    },

    // Reset token expiration time.
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;