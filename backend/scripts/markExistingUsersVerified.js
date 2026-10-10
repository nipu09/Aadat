// Run ONCE after deploying email verification, so people who signed up before
// it existed aren't locked out:   npm run migrate:verify-existing
const mongoose = require("mongoose");
const env = require("../src/config/env");
const User = require("../src/models/User");

(async () => {
  await mongoose.connect(env.mongoUri);
  const result = await User.updateMany({ isVerified: { $exists: false } }, { $set: { isVerified: true } });
  console.log(`Marked ${result.modifiedCount} existing user(s) as verified.`);
  await mongoose.disconnect();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
