const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const multer = require("multer");
const dbPool = require("../db");
const router = express.Router();
const sharp = require("sharp");
const fs = require("fs");
const isLoggedIn = require("../middleware/auth");



// Profile picture upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      req.session.user.id + "_" + Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  }
});

// Profile picture upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  }
});


/* ================= LANDING PAGE ================= */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

/* ================= HOME (AFTER LOGIN) ================= */
router.get("/home", (req, res) => {
  if (!req.session.user) return res.redirect("/signin");
  res.sendFile(path.join(__dirname, "../views/home.html"));
});

/* ================= AUTH PAGES ================= */
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/signup.html"));
});

router.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/signin.html"));
});

router.get("/profile", (req, res) => {
  if (!req.session.user) return res.redirect("/signin");
  res.sendFile(path.join(__dirname, "../views/profile.html"));
});



// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.query(
      "INSERT INTO users (name, email, password, gender) VALUES ($1,$2,$3,$4)",
      [name, email, hashedPassword, gender]
    );

    res.redirect("/signin?signup=success");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Signup failed");
  }
});


/* ================= SIGNIN ================= */
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await dbPool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.redirect("/signin?error=Invalid email or password");
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.redirect("/signin?error=Invalid email or password");
    }

    req.session.user = {
      id: user.user_id,
      name: user.name,
      gender: user.gender
    };

    res.redirect("/home?success=1");
  } catch (err) {
    console.error(err);
    res.redirect("/signin?error=Something went wrong");
  }
});


// api profile from db
router.get("/api/profile", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await dbPool.query(
      "SELECT name, email, college, mobile, linkedin, city, dob, career, gender, profile_pic FROM users WHERE user_id = $1",
      [req.session.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

/* ================= SESSION STATUS ================= */
router.get("/session-status", async (req, res) => {
  if (!req.session.user) {
    return res.json({ loggedIn: false });
  }

  try {
    const result = await dbPool.query(
      "SELECT name, gender, profile_pic FROM users WHERE user_id = $1",
      [req.session.user.id]
    );

    const user = result.rows[0];

    res.json({
      loggedIn: true,
      user: {
        name: user.name,
        gender: user.gender,
        profile_pic: user.profile_pic
      }
    });

  } catch (err) {
    console.error("Session-status error:", err);
    res.json({ loggedIn: false });
  }
});




// Profile update
router.post(
  "/profile/update",
  upload.single("profile_pic"),
  async (req, res) => {

    if (!req.session.user) return res.redirect("/signin");

    const userId = req.session.user.id;

    const {
      college,
      mobile,
      linkedin,
      city,
      dob,
      career,
      gender
    } = req.body;

    let profilePicPath = null;
    if (!fs.existsSync("uploads/profiles")) {
  fs.mkdirSync("uploads/profiles", { recursive: true });
}

    if (req.file) {
      const filename = `profile_${userId}_${Date.now()}.jpg`;
      const outputPath = `uploads/profiles/${filename}`;

      await sharp(req.file.buffer)
        .resize(300, 300)
        .jpeg({ quality: 70 })
        .toFile(outputPath);

      profilePicPath = `/uploads/profiles/${filename}`;
    }

    const result = await dbPool.query(
      `
      UPDATE users SET
        college = $1,
        mobile = $2,
        linkedin = $3,
        city = $4,
        dob = $5,
        career = $6,
        gender = $7,
        profile_pic = COALESCE($8, profile_pic)
      WHERE user_id = $9
      `,
      [
        college || null,
        mobile || null,
        linkedin || null,
        city || null,
        dob || null,
        career || null,
        gender || null,
        profilePicPath,
        userId
      ]
    );

    console.log("Rows updated:", result.rowCount); // should be 1

    res.redirect("/profile?success=1");
  }
);


// syllabus
router.get("/syllabus", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/syllabus.html"));
});

// Semester 1
router.get("/semester1", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "../views/semester1.html"));
});

// Semester 2
router.get("/semester2", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "../views/semester2.html"));
});

// Semester 3
router.get("/semester3", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "../views/semester3.html"));
}); 

// Semester 4
router.get("/semester4", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "../views/semester4.html"));
});

// Semester 5
router.get("/semester5", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "../views/semester5.html"));
});

// Semester 6
router.get("/semester6", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "../views/semester6.html"));
}); 

//dashboard
router.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "../views/dashboard.html"));
});



// Aptitude Test
router.get("/aptitude", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "../views/aptitude.html"));
});

// Dashboard API
router.get("/api/dashboard", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userId = req.session.user.id;

    const result = await dbPool.query(
      `SELECT 
        name,
        email,
        college,
        mobile,
        city,
        career,
        dob,
        gender,
        profile_pic
       FROM users
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      ...result.rows[0],
      notes: 12,        // demo (later DB se)
      assignments: 6,   // demo
      tests: 3          // demo
    });

  } catch (err) {
    console.error("Dashboard API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Database connection check
dbPool.query("SELECT 1")
  .then(() => console.log("DB CONNECTED ✅"))
  .catch(err => console.error("DB ERROR ❌", err));

/* ================= LOGOUT ================= */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
