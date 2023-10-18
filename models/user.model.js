const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const roleSchema = new mongoose.Schema({
  //customer. admin, restaurant-owner
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Frist name should not be empty!"],
    },
    lastName: { type: String, required: [true, "Last name should not be empty!"] },
    email: {
      type: String,
      trim: true,
      index: { unique: true },
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: roleSchema,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    verified: { type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

// Statics
userSchema.statics.compare = async (candidatePassword, password) => {
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
