let io;

function InitializeSocket(socketIoInstance) {
  io = socketIoInstance;
}

async function broadcastMessage(msg) {
  console.log(`Broadcasting message: ${msg}`);
  if (io) {
    io.emit("kafka message", msg);
  }
}

module.exports = {
  InitializeSocket,
  broadcastMessage,
};
// const { io } = require("../app"); // השתמש ב- io שהוגדר ב-app.js
// const socket = io();
// // קליטת הודעת Sugar Alert
// io.on("connection", (socket) => {
//   socket.on("highSugarAlert", (data) => {
//     console.log("High sugar alert received:", data.message);

//     // הצגת ההודעה באתר (כדוגמה, אלמנט `<div>` שנוסף לעמוד)
//     const alertBox = document.createElement("div");
//     alertBox.textContent = data.message;
//     alertBox.style.position = "fixed";
//     alertBox.style.top = "10px";
//     alertBox.style.right = "10px";
//     alertBox.style.backgroundColor = "red";
//     alertBox.style.color = "white";
//     alertBox.style.padding = "10px";
//     alertBox.style.borderRadius = "5px";
//     alertBox.style.zIndex = "1000";

//     document.body.appendChild(alertBox);

//     // הסרת ההודעה לאחר 5 שניות
//     setTimeout(() => {
//       alertBox.remove();
//     }, 5000);
//   });
// });
