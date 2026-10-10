const entryService = require("../services/entry.service");

exports.getYear = async (req, res) => {
  const { habitId } = req.params;
  const year = Number(req.params.year);
  const entries = await entryService.getYearEntries(req.user._id, habitId, year);
  res.status(200).json({ habitId, year, entries });
};

exports.setStatus = async (req, res) => {
  const { habitId, date } = req.params;
  const { status } = req.body;
  const entry = await entryService.setEntryStatus(req.user._id, habitId, date, status);

  if (status === 0) {
    return res.status(200).json({ message: "Entry deleted successfully", habitId, date, status: 0 });
  }
  res.status(200).json({ message: "Entry saved successfully", entry });
};
