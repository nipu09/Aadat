// Mounted at /api/habits/:habitId/entries
const router = require("express").Router({ mergeParams: true });
const c = require("../controllers/entry.controller");
const requireLogin = require("../middleware/requireLogin");
const validate = require("../middleware/validate");
const v = require("../validators/habit.validators");

router.use(requireLogin);

router.get("/:year", validate(v.yearParams, "params"), c.getYear);
router.put("/:date", validate(v.setEntryParams, "params"), validate(v.setEntryBody), c.setStatus);

module.exports = router;
