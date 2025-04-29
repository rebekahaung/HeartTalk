async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const message = inputField.value.trim();

  if (message === "") return;

  const chatWindow = document.getElementById("chat-window");

  chatWindow.innerHTML += `<div class="user-message"><strong>You:</strong> ${message}</div>`;
  inputField.value = "";

  const loadingMessage = document.createElement("div");
  loadingMessage.setAttribute("id", "loading");
  loadingMessage.innerHTML = `<em>HeartTalk is thinking <span id="hearts">❤️</span></em>`;
  chatWindow.appendChild(loadingMessage);
  chatWindow.scrollTop = chatWindow.scrollHeight;

 
  const hearts = ["❤️", "❤️❤️", "❤️❤️❤️"];
  let current = 0;
  const interval = setInterval(() => {
    document.getElementById("hearts").textContent = hearts[current];
    current = (current + 1) % hearts.length;
  }, 500);

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    const botResponse = data.response;

    clearInterval(interval);
    const loadingElement = document.getElementById("loading");
    if (loadingElement) loadingElement.remove();

    chatWindow.innerHTML += `<div class="bot-message"><strong>HeartTalk:</strong> ${botResponse}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;

  } catch (error) {
    clearInterval(interval);
    const loadingElement = document.getElementById("loading");
    if (loadingElement) loadingElement.remove();

    chatWindow.innerHTML += `<div class="bot-message"><strong>HeartTalk:</strong> Error connecting to server.</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

document.getElementById("user-input").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); 
    sendMessage();
  }
});
