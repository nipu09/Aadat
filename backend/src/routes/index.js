const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/habits/:habitId/entries", require("./entry.routes"));
router.use("/habits", require("./habit.routes"));

module.exports = router;
