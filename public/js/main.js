/* =====================================================
   SAFE UTILS
===================================================== */
function $(id) {
  return document.getElementById(id);
}

/* =====================================================
   PASSWORD VALIDATION (Signup)
===================================================== */
function validatePassword() {
  const password = $("password");
  if (password && password.value.length < 6) {
    showToast("invalid", "Password must be at least 6 characters");
    return false;
  }
  return true;
}

/* =====================================================
   SESSION & NAVBAR USER STATE
===================================================== */
async function loadUserInNavbar() {
  try {
    const res = await fetch("/session-status");
    const data = await res.json();

    const userSection = $("userSection");
    const loginLink = $("loginLink");
    const signupLink = $("signupLink");
    const logoutLink = $("logoutLink");
    const userName = $("userName");
    const profilePic = $("profilePic");

    if (!data.loggedIn) {
      userSection?.classList.add("d-none");
      loginLink?.classList.remove("d-none");
      signupLink?.classList.remove("d-none");
      logoutLink?.classList.add("d-none");
      return;
    }

    loginLink?.classList.add("d-none");
    signupLink?.classList.add("d-none");
    logoutLink?.classList.remove("d-none");
    userSection?.classList.remove("d-none");

    if (userName) userName.innerText = data.user.name;

    if (profilePic) {
      const fallback =
        data.user.gender === "female"
          ? "/uploads/female.png"
          : "/uploads/male.png";

      profilePic.src =
        data.user.profile_pic && data.user.profile_pic.startsWith("/uploads")
          ? data.user.profile_pic
          : fallback;

      profilePic.onerror = () => {
        profilePic.onerror = null;
        profilePic.src = fallback;
      };
    }

  } catch (err) {
    console.error("Navbar session error:", err);
  }
}

/* =====================================================
   THEME TOGGLE (NULL SAFE)
===================================================== */
function initThemeToggle() {
  const toggleBtn = $("themeToggle");
  if (!toggleBtn) return;

  const body = document.body;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    toggleBtn.innerText = "☀️";
  } else {
    toggleBtn.innerText = "🌙";
  }

  applyTableTheme();

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.innerText = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.innerText = "🌙";
    }

    document.dispatchEvent(new Event("themeChanged"));
  });
}

/* =====================================================
   TABLE DARK/LIGHT HANDLER
===================================================== */
function applyTableTheme() {
  const isDark = document.body.classList.contains("dark");
  const isSyllabus = document.body.dataset.page === "syllabus";
  if (isSyllabus) return;

  document.querySelectorAll("table.table").forEach(table => {
    table.classList.toggle("table-dark", isDark);
  });
}

document.addEventListener("themeChanged", applyTableTheme);

/* =====================================================
   PROFILE PAGE DATA
===================================================== */
async function loadProfileData() {
  try {
    const res = await fetch("/api/profile");
    const data = await res.json();

    if ($("name")) $("name").value = data.name || "";
    if ($("email")) $("email").value = data.email || "";
    if ($("college")) $("college").value = data.college || "";
    if ($("mobile")) $("mobile").value = data.mobile || "";
    if ($("linkedin")) $("linkedin").value = data.linkedin || "";
    if ($("city")) $("city").value = data.city || "";
    if ($("career")) $("career").value = data.career || "";

    if ($("dob")) {
      $("dob").value = data.dob
        ? new Date(data.dob).toISOString().split("T")[0]
        : "";
    }

    if ($("gender")) $("gender").value = data.gender || "";

    if ($("profilePreview") && data.profile_pic) {
      $("profilePreview").src = data.profile_pic;
    }

  } catch (err) {
    console.error("Profile load error:", err);
  }
}

function previewProfile(event) {
  const img = $("profilePreview");
  if (img) img.src = URL.createObjectURL(event.target.files[0]);
}

/* =====================================================
   DASHBOARD DATA
===================================================== */
async function loadDashboard() {
  try {
    const res = await fetch("/api/dashboard");
    const data = await res.json();

    if ($("dashName")) $("dashName").innerText = data.name;
    if ($("dashEmail")) $("dashEmail").innerText = data.email;
    if ($("dashCollege")) $("dashCollege").innerText = data.college || "—";
    if ($("dashMobile")) $("dashMobile").innerText = data.mobile || "—";
    if ($("dashCity")) $("dashCity").innerText = data.city || "—";
    if ($("dashCareer")) $("dashCareer").innerText = data.career || "—";
    if ($("dashGender")) $("dashGender").innerText = data.gender || "—";

    if ($("dashDob")) {
      if (data.dob) {
        const d = new Date(data.dob);
        $("dashDob").innerText =
          `${String(d.getDate()).padStart(2, "0")}-` +
          `${String(d.getMonth() + 1).padStart(2, "0")}-` +
          d.getFullYear();
      } else {
        $("dashDob").innerText = "—";
      }
    }

    if ($("notesCount")) $("notesCount").dataset.count = data.notes || 0;
    if ($("assignmentCount")) $("assignmentCount").dataset.count = data.assignments || 0;
    if ($("testCount")) $("testCount").dataset.count = data.tests || 0;

    animateCounters();

    if ($("dashProfilePic")) {
      $("dashProfilePic").src =
        data.profile_pic ||
        (data.gender === "female" ? "/uploads/female.png" : "/uploads/male.png");
    }

  } catch (err) {
    console.error("Dashboard load error:", err);
  }
}

/* =====================================================
   COUNTER ANIMATION
===================================================== */
function animateCounters() {
  document.querySelectorAll(".stat-count").forEach(el => {
    const target = +el.dataset.count;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.innerText = target;
        clearInterval(timer);
      } else {
        el.innerText = current;
      }
    }, 30);
  });
}

/* =====================================================
   URL-BASED TOAST TRIGGER (LOGIN / ERROR)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("error")) {
    showToast("error", params.get("error"));
  }

  if (params.get("success")) {
    showToast("success", "Welcome back 🎉 Login successful!");
  }

  initThemeToggle();
  loadUserInNavbar();
  applyTableTheme();
});
