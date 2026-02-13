require("dotenv").config();
const pool = require("./db");
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");

const app = express(); // ✅ app defined here

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

  

const dbPool = require("./db"); // SAME pool

app.use(
  session({
    store: new pgSession({
      pool: dbPool,          // ✅ USE SAME POOL
      tableName: "session"
    }),
    secret: "teach-with-dost-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);




// Session
app.use(
  session({
    store: new pgSession({
      conString: "postgres://postgres:password@localhost:5432/teach_with_dost",
    }),
    secret: "teach-with-dost-secret",
    resave: false,
    saveUninitialized: false,
  })
);



// Routes
app.use("/", require("./routes/authRoutes"));
const downloadRoutes = require("./routes/downloadRoutes");
app.use("/", downloadRoutes);



// Server
const PORT = 3000;
// clear all sessions on server restart
(async () => {
  try {
    await pool.query('DELETE FROM "session"');
    console.log("✅ Sessions cleared on restart");
  } catch (err) {
    console.error(err);
  }
})();

// 👇 keep this at the bottom
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
