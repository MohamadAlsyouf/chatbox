import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat';

// establishes connection to socket.io server
const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);


  // establishes connection between the user and the socket.io room.
  // 'room' will be sent to server-side as 'data' parameter.
  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      socket.emit("get_users", userName)
      console.log("userName: ", userName)
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="home-wrapper">
          <div className="joinChatContainer">
          <h3>ChatBox</h3>
          <p>Enter Name and share Room ID < br/> to begin!
          </p>
          <input
            type="text"
            placeholder="Name..."
            onChange={(event) => {
              setUserName(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
            onKeyDown={(event) => {
            event.key === "Enter" && joinRoom();
          }}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
        </div>

      )
      : (
      <Chat socket={socket} userName={userName} room={room}/>
      )}
    </div>
  );
};

export default App;
