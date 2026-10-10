const Entry = require("../models/Entry");
const AppError = require("../utils/AppError");
const { getTodayString } = require("../utils/date");
const { assertOwnedHabit } = require("./habit.service");

async function getYearEntries(userId, habitId, year) {
  await assertOwnedHabit(userId, habitId);

  const start = `${year}-01-01`;
  const end = `${String(year + 1).padStart(4, "0")}-01-01`;

  const found = await Entry.find({
    habit: habitId,
    date: { $gte: start, $lt: end },
    status: { $in: [1, 2] },
  }).sort({ date: 1 });

  return found.map((e) => ({ date: e.date, status: e.status }));
}

// Only today's entry can be created, changed or cleared.
async function setEntryStatus(userId, habitId, date, status) {
  const today = getTodayString();
  if (date !== today) {
    throw new AppError(
      date < today ? "Past days can't be changed" : "Future days can't be changed",
      403,
      "DATE_LOCKED",
    );
  }

  await assertOwnedHabit(userId, habitId);

  // Status 0 means "clear the day"
  if (status === 0) {
    await Entry.deleteOne({ habit: habitId, user: userId, date });
    return null;
  }

  return Entry.findOneAndUpdate(
    { habit: habitId, date },
    { $set: { habit: habitId, user: userId, date, status } },
    { upsert: true, returnDocument: "after", runValidators: true },
  );
}

module.exports = { getYearEntries, setEntryStatus };
