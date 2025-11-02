const passport = require("passport");

// 🧩 Keep basic session serialization/deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // You can still require your User model if needed
    const User = require("../models/User");
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ⚠️ Google OAuth temporarily disabled
console.log("⚠️ Google OAuth is disabled — add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable.");

module.exports = passport;
