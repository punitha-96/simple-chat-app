const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const rooms = {}; // Store room information

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const msg = JSON.parse(message);

    switch (msg.type) {
      case "join":
        // User joins a room
        if (!rooms[msg.room]) {
          rooms[msg.room] = [];
        }
        rooms[msg.room].push(ws);
        ws.room = msg.room;
        ws.username = msg.username;
        broadcastRooms();
        break;

      case "message":
        // Broadcast message to all users in the room
        if (rooms[msg.room]) {
          rooms[msg.room].forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              const messageData = {
                type: "message",
                username: msg.username,
                message: msg.message,
                timestamp: Date.now(),
              };
              client.send(JSON.stringify(messageData));
            }
          });
        }
        break;

      case "leave":
        // Handle user leaving the room
        if (rooms[ws.room]) {
          rooms[ws.room] = rooms[ws.room].filter((client) => client !== ws);
          if (rooms[ws.room].length === 0) {
            delete rooms[ws.room];
          }
          broadcastRooms();
        }
        break;
    }
  });

  ws.on("close", () => {
    // Handle user disconnecting
    if (rooms[ws.room]) {
      rooms[ws.room] = rooms[ws.room].filter((client) => client !== ws);
      if (rooms[ws.room].length === 0) {
        delete rooms[ws.room];
      }
      broadcastRooms();
    }
  });
});

function broadcastRooms() {
  // Notify all users about the available rooms
  const roomList = Object.keys(rooms);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "rooms", rooms: roomList }));
    }
  });
}

console.log("WebSocket server is running on ws://localhost:8080");
