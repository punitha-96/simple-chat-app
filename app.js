document.addEventListener("DOMContentLoaded", () => {
  // Establish WebSocket connection
  let socket;

  function connectWebSocket() {
    socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed, attempting to reconnect...");
      setTimeout(connectWebSocket, 1000); // Attempt to reconnect after 1 second
    });

    socket.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "message") {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<strong>${msg.username}</strong>: ${
          msg.message
        } <em>${new Date(msg.timestamp).toLocaleTimeString()}</em>`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } else if (msg.type === "rooms") {
        roomListContainer.innerHTML = "";
        msg.rooms.forEach((room) => {
          const roomElement = document.createElement("div");
          roomElement.textContent = room;
          roomElement.classList.add("room");
          roomListContainer.appendChild(roomElement);
          roomElement.addEventListener("click", () => {
            roomInput.value = room;
          });
        });
      }
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  connectWebSocket();

  // Get references to DOM elements
  const usernameInput = document.getElementById("username");
  const roomInput = document.getElementById("room");
  const joinButton = document.getElementById("join"); // This should fix the ReferenceError
  const chatWindow = document.getElementById("chat-window");
  const roomNameDisplay = document.getElementById("room-name");
  const leaveButton = document.getElementById("leave-room");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send");
  const messagesContainer = document.getElementById("messages");
  const roomListContainer = document.getElementById("room-list");

  let currentRoom = "";
  let currentUsername = "";

  joinButton.addEventListener("click", () => {
    console.log("Join button clicked");
    const username = usernameInput.value.trim();
    const room = roomInput.value.trim();
    console.log(`Username: ${username}, Room: ${room}`);
    if (username && room) {
      currentUsername = username;
      currentRoom = room;
      if (socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket is open. Sending join request...");
        socket.send(JSON.stringify({ type: "join", username, room }));
      } else {
        console.error("WebSocket is not open. ReadyState:", socket.readyState);
      }
      roomNameDisplay.textContent = `Room: ${room}`;
      chatWindow.style.display = "flex";
      usernameInput.disabled = true;
      roomInput.disabled = true;
      joinButton.disabled = true;
    } else {
      console.error("Username or Room is empty.");
    }
  });

  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
      const msg = {
        type: "message",
        room: currentRoom,
        username: currentUsername,
        message,
      };
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
        messageInput.value = "";
      } else {
        console.error("Cannot send message, WebSocket is not open.");
      }
    }
  });

  leaveButton.addEventListener("click", () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "leave",
          room: currentRoom,
          username: currentUsername,
        })
      );
    }
    chatWindow.style.display = "none";
    usernameInput.disabled = false;
    roomInput.disabled = false;
    joinButton.disabled = false;
    usernameInput.value = "";
    roomInput.value = "";
    messagesContainer.innerHTML = "";
    currentRoom = "";
  });
});
