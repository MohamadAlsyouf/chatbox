import React, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, userName, room}) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    const date = new Date();
    console.log(date);
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time: new Intl.DateTimeFormat('en-US', {timeStyle: "short"}).format(date)
      }
      console.log(messageData.time);
      console.log(messageData);
      await socket.emit("send_message", messageData)
      // line 23 sets messageList not only when we receive
      // a message(31), but when we send a message as well.
      setMessageList((list) => [...list, messageData])
      setCurrentMessage("");
    }
  };

  // this message event is emitted(server),
  // keeps track of previous data (messages)
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data])
    })
  }, [socket])

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Ezoic Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
            <div
              className="message"
              id={userName === messageContent.author ? "other" : "you"}
              key={index}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
            )
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Chat..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat;
