const cursor = document.getElementById("time-cursor");

setInterval(() => {
  handleMoveCursor();
}, 1000 * 60);

function handleMoveCursor() {
  const now = new Date();
  if (now.getHours() < 7) {
    cursor.style.top = "19px";
    return;
  }
  if (now.getHours() > 21) {
    cursor.style.top = "100%";
    return;
  }

  cursor.style.top = `${(now.getHours() / 14) * 100}%`;
}
handleMoveCursor();
