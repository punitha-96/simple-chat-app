# Simple Chat App

The Simple Chat App is a basic web-based chat application that allows users to join chat rooms, send and receive messages in real-time, and manage chat rooms. The app is built using HTML, CSS, JavaScript, and WebSockets, with a Node.js server.

## simple-chat-app/

├── index.html - Main HTML file

├── app.js - Frontend JavaScript for handling UI interactions and WebSocket communication

├── server.js - Node.js server file for handling WebSocket connections and room management

├── styles.css - CSS file for styling the app

├── package.json - Project metadata and dependencies

└── README.md - Project documentation

## Technologies Used

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6)
- **Backend:**
  - Node.js
  - WebSocket (`ws` library)
  - Express (for serving static files)
  - Socket.io (for real-time communication)

## Prerequisites

- Node.js (version 14 or higher)
- NPM (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/simple-chat-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd simple-chat-app
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Install the `ws` package for WebSocket support:

   ```bash
   npm install ws
   ```

## Run Locally

Start the Node.js WebSocket server:

```bash
npm start
```

Open index.html in your web browser.

## Using the Chat App

1. Enter a username and a chat room name.
2. Click the "Join Room" button.
3. Start sending messages! You can leave the room by clicking the "Leave Room" button.

## Support

For any questions, please contact [punithakathirvel6@gmail.com].
