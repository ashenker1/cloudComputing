console.log("JavaScript Loaded");

// קבלת אלמנטים מהדף
const loginBtn = document.getElementById("loginBtn");
const modal = document.getElementById("loginModal");
const closeBtn = document.getElementsByClassName("close")[0];
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

console.log(loginBtn);
console.log(modal);
console.log(closeBtn);

// פתח את החלון הקופץ כשנלחץ על הכפתור
loginBtn.onclick = function () {
  modal.style.display = "block";
  errorMessage.textContent = ""; // אפס את הודעת השגיאה כשנפתח את החלון
};

// סגור את החלון הקופץ כשנלחץ על ה-X
closeBtn.onclick = function () {
  modal.style.display = "none";
};

// סגור את החלון הקופץ כשילחצו מחוץ לחלון
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// טיפול בהגשת הטופס
loginForm.onsubmit = async function (event) {
  event.preventDefault(); // מניעת הגשה אוטומטית של הטופס

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // בדוק אם השדות ריקים
  if (!username || !password) {
    errorMessage.textContent = "אנא מלא את כל השדות."; // הצגת הודעת שגיאה במקרה של שדות ריקים
    return;
  }

  // שליחת הנתונים לשרת
  const response = await fetch("/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  console.log(response); // להדפיס את התגובה כדי לבדוק את הסטטוס

  if (response.ok) {
    // אם ההתחברות הצליחה, נבצע הפניה לדף הדשבורד
    window.location.href = "/users/dashboard";
  } else {
    // אם ההתחברות נכשלה, נציג הודעת שגיאה
    const errorText = await response.json(); // לקבלת הודעת השגיאה בפורמט JSON
    errorMessage.textContent = errorText.message; // עדכון הודעת השגיאה
  }
};
