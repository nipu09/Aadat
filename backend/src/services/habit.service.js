const Habit = require("../models/Habit");
const Entry = require("../models/Entry");
const AppError = require("../utils/AppError");

const listHabits = (userId) => Habit.find({ user: userId }).sort({ createdAt: 1 });

const createHabit = (userId, name) => Habit.create({ h_name: name, user: userId });

async function assertOwnedHabit(userId, habitId) {
  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) throw new AppError("Habit not found", 404, "HABIT_NOT_FOUND");
  return habit;
}

async function deleteHabit(userId, habitId) {
  const habit = await Habit.findOneAndDelete({ _id: habitId, user: userId });
  if (!habit) throw new AppError("Habit not found", 404, "HABIT_NOT_FOUND");
  await Entry.deleteMany({ habit: habit._id });
  return habit;
}

module.exports = { listHabits, createHabit, assertOwnedHabit, deleteHabit };
