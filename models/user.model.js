const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const crypto = require('crypto');

const { AutoIncrement } = require("../config/db");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name should not be empty!"],
    },
    lastName: { type: String, required: [true, "Last name should not be empty!"] },
    phone: { type: String, required: [true, "Phone should not be empty!"] },
    email: {
      type: String,
      trim: true,
      index: { unique: true },
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlenght: 8,
    },
    // passwordConfirm: {
    //   type: String,
    //   require: [true, "Please provide a password"],
    //   validate: {
    //     //This only works on CRETATE and SAVE
    //     validator: function (el) {
    //       return el === this.password;
    //     },
    //     message: "Password not the same",
    //   },
    // },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["admin", "customer", "restaurant-owner"],
      required: true,
      default: "customer",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    verified: { type: Boolean, default: false },
    numericId: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  }

);
userSchema.path('photo').select(false);
userSchema.path('verified').select(false);
userSchema.path('phone').select(false);
userSchema.path('password').select(false);
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

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  console.log({resetToken}, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

userSchema.plugin(AutoIncrement, { inc_field: "numericId" });

const User = mongoose.model("user", userSchema);
module.exports = User;
