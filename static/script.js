async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const message = inputField.value.trim();
  
  if (message === "") return;

  const chatWindow = document.getElementById("chat-window");
  chatWindow.innerHTML += `<div class="user-message"><strong>You:</strong> ${message}</div>`;
  inputField.value = "";

  // Show animated heart loading
  const loadingMessage = document.createElement("div");
  loadingMessage.setAttribute("id", "loading");
  loadingMessage.innerHTML = `<em>HeartTalk is thinking <span id="hearts">❤️</span></em>`;
  chatWindow.appendChild(loadingMessage);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Heart animation
  let hearts = ["❤️", "❤️❤️", "❤️❤️❤️"];
  let current = 0;
  const interval = setInterval(() => {
    document.getElementById("hearts").textContent = hearts[current];
    current = (current + 1) % hearts.length;
  }, 500);

  try {
    const response = await fetch('http://localhost:5001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    const botResponse = data.response;

    clearInterval(interval); // Stop heart animation
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.remove();
    }

    chatWindow.innerHTML += `<div class="bot-message"><strong>HeartTalk:</strong> ${botResponse}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    clearInterval(interval); // Stop heart animation
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.remove();
    }
    chatWindow.innerHTML += `<div class="bot-message"><strong>HeartTalk:</strong> Error connecting to server.</div>`;
  }
}

// NEW: Listen for Enter key
document.getElementById("user-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();  // Prevent default "newline" action
    sendMessage();           // Call sendMessage()
  }
});
