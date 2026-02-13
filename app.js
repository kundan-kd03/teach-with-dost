require("dotenv").config();
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");
const pool = require("./db"); // ✅ VERY IMPORTANT
const app = express();




app.use("/uploads", express.static(path.join(__dirname, "uploads")));
/* ================= Middleware ================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ================= Session ================= */
app.use(
  session({
    store: new pgSession({
      pool: pool, // ✅ NOW pool IS DEFINED
      tableName: "session"
    }),
    secret: process.env.JWT_SECRET || "teach-with-dost-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60
    }
  })
);

/* ================= Static Files ================= */
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

/* ================= Routes ================= */
app.get("/", (req, res) => {
  res.send("Backend running successfullyy 🚀");
});

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/downloadRoutes"));

/* ================= Server ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
