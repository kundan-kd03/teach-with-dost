

let timer = null;
let timeLeft = 10;







// ===============================
// QUESTIONS (10 shown randomly)
// ===============================
const questions = [
  // { q: "What is 25% of 200?", options: ["25", "40", "50", "60"], answer: "50" },
  // { q: "2, 4, 8, 16, ?", options: ["18", "24", "32", "34"], answer: "32" },
  // { q: "Odd one out: 3, 5, 7, 9", options: ["3", "5", "7", "9"], answer: "9" },
  // { q: "Speed of train is 60 km/h. Distance in 30 min?", options: ["15", "20", "30", "40"], answer: "30" },
  // { q: "If x = 2, value of x² + 3x?", options: ["10", "12", "14", "16"], answer: "10" },
  // { q: "10 workers do work in 5 days. 5 workers?", options: ["5", "10", "15", "20"], answer: "10" },
  // { q: "Simple interest of ₹100 at 10% for 1 year?", options: ["5", "10", "15", "20"], answer: "10" },
  // { q: "Next prime after 7?", options: ["9", "10", "11", "13"], answer: "11" },
  // { q: "LCM of 4 and 6?", options: ["8", "10", "12", "14"], answer: "12" },
  // { q: "Cube of 3?", options: ["6", "9", "18", "27"], answer: "27" },
      
    /* =======================
      PERCENTAGE (1–40)
    ======================= */
    { q: "What is 25% of 200?", options: ["25", "40", "50", "60"], answer: "50" },
    { q: "50% of 80 is?", options: ["20", "30", "40", "50"], answer: "40" },
    { q: "10% of 450?", options: ["35", "40", "45", "50"], answer: "45" },
    { q: "75% of 120?", options: ["80", "85", "90", "100"], answer: "90" },
    { q: "20% of 300?", options: ["40", "50", "60", "70"], answer: "60" },
    { q: "30% of 500?", options: ["100", "150", "200", "250"], answer: "150" },
    { q: "15% of 200?", options: ["20", "25", "30", "35"], answer: "30" },
    { q: "5% of 1000?", options: ["25", "50", "75", "100"], answer: "50" },
    { q: "40% of 250?", options: ["80", "90", "100", "110"], answer: "100" },
    { q: "60% of 150?", options: ["80", "85", "90", "95"], answer: "90" },

    { q: "If 20% ? = 40, total = ?", options: ["100", "150", "200", "250"], answer: "200" },
    { q: "Increase 100 by 20%", options: ["110", "115", "120", "125"], answer: "120" },
    { q: "Decrease 200 by 10%", options: ["160", "170", "180", "190"], answer: "180" },
    { q: "What percent is 25 of 100?", options: ["20%", "25%", "30%", "40%"], answer: "25%" },
    { q: "What percent is 40 of 200?", options: ["10%", "15%", "20%", "25%"], answer: "20%" },

    /* =======================
      TIME & WORK (41–80)
    ======================= */
    { q: "5 men can do a work in 10 days. Time for 10 men?", options: ["2", "5", "10", "20"], answer: "5" },
    { q: "10 workers do work in 6 days. 5 workers take?", options: ["6", "10", "12", "15"], answer: "12" },
    { q: "A can do work in 10 days. B in 20 days. Together?", options: ["5", "6.67", "7", "8"], answer: "6.67" },
    { q: "A does work in 12 days. Daily work?", options: ["1/12", "1/10", "1/8", "1/6"], answer: "1/12" },
    { q: "If A works twice as fast as B, ratio?", options: ["1:2", "2:1", "3:1", "1:3"], answer: "2:1" },

    { q: "15 men finish work in 20 days. Days for 10 men?", options: ["25", "30", "35", "40"], answer: "30" },
    { q: "6 persons do work in 15 days. 3 persons?", options: ["15", "20", "25", "30"], answer: "30" },
    { q: "Work done by 1 man in 1 day if 10 men do in 5 days?", options: ["1/50", "1/25", "1/10", "1/5"], answer: "1/50" },

    /* =======================
      NUMBER SERIES (81–120)
    ======================= */
    { q: "2, 4, 8, 16, ?", options: ["18", "24", "32", "34"], answer: "32" },
    { q: "1, 4, 9, 16, ?", options: ["20", "25", "30", "36"], answer: "25" },
    { q: "5, 10, 20, 40, ?", options: ["60", "70", "80", "90"], answer: "80" },
    { q: "3, 6, 9, 12, ?", options: ["14", "15", "16", "18"], answer: "15" },
    { q: "7, 14, 28, ?", options: ["42", "49", "56", "64"], answer: "56" },

    { q: "1, 1, 2, 3, 5, ?", options: ["6", "7", "8", "9"], answer: "8" },
    { q: "2, 3, 5, 7, ?", options: ["9", "10", "11", "12"], answer: "11" },
    { q: "10, 20, 40, ?", options: ["60", "70", "80", "90"], answer: "80" },

    /* =======================
      RATIO & PROPORTION (121–150)
    ======================= */
    { q: "Ratio of 2:4 simplified?", options: ["1:4", "1:2", "2:1", "4:1"], answer: "1:2" },
    { q: "Divide 100 in ratio 2:3", options: ["40,60", "50,50", "30,70", "20,80"], answer: "40,60" },
    { q: "Ratio of 20 and 30?", options: ["2:3", "3:2", "4:5", "5:4"], answer: "2:3" },
    { q: "If A:B = 3:5 and B=20, A=?", options: ["10", "12", "15", "18"], answer: "12" },

    /* =======================
      SPEED & DISTANCE (151–180)
    ======================= */
    { q: "Speed = 60 km/hr, time = 2 hr. Distance?", options: ["100", "110", "120", "130"], answer: "120" },
    { q: "Distance 100 km, time 2 hr. Speed?", options: ["40", "50", "60", "70"], answer: "50" },
    { q: "Train travels 30 km in 30 min. Speed?", options: ["30", "40", "50", "60"], answer: "60" },
    { q: "Speed of bike is 20 m/s. In km/hr?", options: ["54", "60", "72", "80"], answer: "72" },

    /* =======================
      LOGICAL / BASIC (181–200)
    ======================= */
    { q: "Odd one out: 2, 4, 6, 9", options: ["2", "4", "6", "9"], answer: "9" },
    { q: "Which is not prime?", options: ["2", "3", "5", "9"], answer: "9" },
    { q: "Day after Monday?", options: ["Sunday", "Tuesday", "Wednesday", "Friday"], answer: "Tuesday" },
    { q: "Opposite of Hot?", options: ["Warm", "Cold", "Heat", "Cool"], answer: "Cold" },
    { q: "How many sides in triangle?", options: ["2", "3", "4", "5"], answer: "3" }

    ];


let currentIndex = 0;
let selectedQuestions = [];
let userAnswers = [];

// ===============================
// START TEST
// ===============================
function startTest() {
  document.getElementById("introCard").classList.add("d-none");

  selectedQuestions = questions
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  userAnswers = new Array(10).fill(null);
  currentIndex = 0;

  renderQuestion();
}

// ===============================
// RENDER SINGLE QUESTION
// ===============================
function renderQuestion() {
  clearInterval(timer);
  timeLeft = 10;

  const q = selectedQuestions[currentIndex];
  const container = document.getElementById("questionContainer");

  container.classList.remove("d-none");

  container.innerHTML = `
    <div class="card aptitude-card shadow p-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="fw-bold mb-0">
          Question ${currentIndex + 1} of 10
        </h6>
        <span class="badge bg-danger fs-6" id="timerBox">
          ⏱ ${timeLeft}s
        </span>
      </div>

      <p class="fw-semibold mt-2">${q.q}</p>

      ${q.options.map(opt => `
        <div class="form-check mt-2">
          <input class="form-check-input" type="radio"
            name="answer"
            value="${opt}"
            ${userAnswers[currentIndex] === opt ? "checked" : ""}
            onchange="saveAnswer('${opt}')">
          <label class="form-check-label">${opt}</label>
        </div>
      `).join("")}

      <div class="d-flex justify-content-between mt-4">
        <button class="btn apt-btn-outline"
          onclick="prevQuestion()"
          ${currentIndex === 0 ? "disabled" : ""}>
          ⬅ Previous
        </button>

        ${
          currentIndex === 9
            ? `<button class="btn apt-btn" onclick="submitTest()">Submit</button>`
            : `<button class="btn apt-btn" onclick="nextQuestion()">Next ➡</button>`
        }
      </div>
    </div>
  `;

  startTimer();
}

// START TIMER
function startTimer() {
  const timerBox = document.getElementById("timerBox");

  timer = setInterval(() => {
    timeLeft--;
    if (timerBox) timerBox.innerText = `⏱ ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timer);

      if (currentIndex < 9) {
        currentIndex++;
        renderQuestion();
      } else {
        submitTest();
      }
    }
  }, 1000);
}


// ===============================
// SAVE ANSWER
// ===============================
function saveAnswer(answer) {
  userAnswers[currentIndex] = answer;
}

// ===============================
// NAVIGATION
// ===============================
function nextQuestion() {
  clearInterval(timer);
  if (currentIndex < 9) {
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  clearInterval(timer);
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}


// ===============================
// SUBMIT TEST
// ===============================
function submitTest() {
  clearInterval(timer);

  let score = 0;
  selectedQuestions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });

  document.getElementById("questionContainer").innerHTML = `
    <div class="card aptitude-card shadow p-4 text-center">
      <h4 class="text-gradient">🎉 Test Submitted</h4>
      <p class="mt-3 fs-5">
        Your Score: <b>${score} / 10</b>
      </p>
    </div>
  `;
}

