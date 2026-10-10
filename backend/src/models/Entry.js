const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Plain "YYYY-MM-DD" string, never a Date object
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    // 1 = half done, 2 = done (0 = no entry)
    status: { type: Number, enum: [0, 1, 2], required: true },
  },
  { timestamps: true },
);

// One entry per habit per day
entrySchema.index({ habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Entry", entrySchema);
