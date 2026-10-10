const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    h_password: { type: String, required: true, select: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.methods.toPublic = function toPublic() {
  return { id: this._id, name: this.name, email: this.email };
};

module.exports = mongoose.model("User", userSchema);
