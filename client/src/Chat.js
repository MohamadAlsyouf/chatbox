import React, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, userName, room}) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([]);

  // this is async so that we wait for the message to be sent before sending currentMessage
  const sendMessage = async () => {
    const date = new Date();
    console.log(date);
    // this object is sent to the server
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
      // line 25 sets messageList not only when we receive
      // a message, but when we send a message as well.
      setMessageList((list) => [...list, messageData])
      console.log("MESSAGE LIST: ", messageList);
      setCurrentMessage("");
    }
  };

  // this message event is emitted(server) whenever the socket changes,
  // keeps track of previous data (messages)
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data])
    })
  }, [socket])

  return (
    <div className="chat-wrapper">
      <div className="chat-window">
        <div className="chat-header">
          <p>ChatBox</p>
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
          <button onClick={sendMessage}>send</button>
        </div>
      </div>
    </div>
  )
}

export default Chat;
