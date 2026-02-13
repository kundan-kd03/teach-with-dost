require("dotenv").config();

const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");

const dbPool = require("./db"); // ✅ Render DATABASE_URL use karega

const app = express();

/* ================= Middleware ================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ================= Static Files ================= */
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

/* ================= Session ================= */
app.use(
  session({
    store: new pgSession({
      pool: pool
    }),
    secret: process.env.JWT_SECRET || "teach-with-dost-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Render free = false
      maxAge: 1000 * 60 * 60
    }
  })
);


/* ================= Routes ================= */
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/downloadRoutes"));

/* ================= Server ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
