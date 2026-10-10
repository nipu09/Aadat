const router = require("express").Router();
const c = require("../controllers/habit.controller");
const requireLogin = require("../middleware/requireLogin");
const validate = require("../middleware/validate");
const v = require("../validators/habit.validators");

router.use(requireLogin);

router.get("/", c.list);
router.post("/", validate(v.createHabitSchema), c.create);
router.delete("/:id", validate(v.habitIdParams, "params"), c.remove);

module.exports = router;
