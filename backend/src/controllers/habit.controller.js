const habitService = require("../services/habit.service");

exports.list = async (req, res) => {
  const habits = await habitService.listHabits(req.user._id);
  res.status(200).json({ message: "Habits fetched successfully", habits });
};

exports.create = async (req, res) => {
  const habit = await habitService.createHabit(req.user._id, req.body.h_name);
  res.status(201).json({ message: "Habit created successfully", habit });
};

exports.remove = async (req, res) => {
  const habit = await habitService.deleteHabit(req.user._id, req.params.id);
  res.status(200).json({ message: "Habit deleted successfully", habitId: habit._id });
};
