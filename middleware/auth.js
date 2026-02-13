/**
 * Authentication Middleware
 * -------------------------
 * This middleware checks whether the user is logged in.
 * If not logged in, user is redirected to the signin page.
 */
const express = require("express");
const router = express.Router();
const dbPool = require("../db");

function isAuthenticated(req, res, next) {
  try {
    // ✅ Check session
    if (!req.session || !req.session.user) {
      // ❌ Not logged in
      return res.redirect("/signin");
    }
    // ✅ Logged in → allow access
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.redirect("/signin");
  }
};

// Dashboard API
router.get("/api/dashboard", isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;

  const user = await dbPool.query(
    "SELECT name, email, college, mobile, city, career, dob, gender, profile_pic FROM users WHERE user_id=$1",
    [userId]
  );
  res.json({
    ...user.rows[0],
    notes: 12,
    assignments: 6,
    tests: 3
  });
});
module.exports = router;
