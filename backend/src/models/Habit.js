const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    h_name: { type: String, required: true, trim: true, maxlength: 40 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Habit", habitSchema);
