import { useContext, useEffect, useRef, useState } from "react";
import "../css/chat.css";
import { appContext } from "../App";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { Tooltip } from "react-tooltip";
import ReactScrollableFeed from "react-scrollable-feed";

export function Chat() {
  const inlineStyles = {
    justifyContent: "right",
    marginRight: "0px",
    flexDirection: "row-reverse",
  };
  const inlineSpanStyles = {
    alignItems: "end",
  };
  const inlineImgStyle = {
    marginLeft: "8px",
  };

  const messageCol = collection(db, "messages");
  const roomCol = collection(db, "rooms");
  const memberCol = collection(db,"roomMembers");
  const { userInfo } = useContext(appContext);
  const [inputText, setInputText] = useState("");
  const joinedCode = JSON.parse(localStorage.getItem("joinedCode"));
  const messageRef = useRef();
  const [messages, setMessages] = useState([]);
  const [chosenRoom, setChosenRoom] = useState([]);
const [roomMember, setRoomMember] = useState([]);
  useEffect(() => {
    const queryMessages = query(
      messageCol,
      where("roomCode", "==", joinedCode),
      orderBy("timeSent")
    );
  
    const queryRooms = query(roomCol, where("roomCode", "==", joinedCode));
    const queryRoomMembers = query(memberCol, where("roomCode", "==", joinedCode),
    orderBy("timeJoined"));

    const unsubscribeMessages = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log("get messages");
      setMessages(messages);
    });
  
    const unsubscribeRooms = onSnapshot(queryRooms, (snapshot) => {
      let rooms = [];
      snapshot.forEach((doc) => {
        rooms.push({ ...doc.data(), id: doc.id });
      });
      console.log("get rooms");
      setChosenRoom(rooms);
    });

    const unsubscribeMembers = onSnapshot(queryRoomMembers, (snapshot) =>{
      let members = []
      snapshot.forEach((doc) => {
        members.push({ ...doc.data(), id: doc.id });
      });
      console.log("get members");
    
      setRoomMember(members);
    })
  
    return () => {
      unsubscribeMembers();
      unsubscribeMessages();
      unsubscribeRooms();
    };
  }, []);
  

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendData();
      setInputText("");
    }
  };

  const handleClick = () => {
    sendData();
    setInputText("");
  };

  const sendData = async () => {
    if (inputText == "" || /^\s*$/.test(inputText)) {
      return;
    } else {
      try {
        await addDoc(messageCol, {
          sender: userInfo.displayName,
          text: messageRef.current.value,
          roomCode: joinedCode,
          timeSent: serverTimestamp(),
          photoUrl: userInfo.photoURL,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  console.log(roomMember)
  return (
    <div className="main-container">
      <div className="chat-container">
        <div className="message-container">
          <ReactScrollableFeed>
            {messages.map((message) => (
              <div
                style={
                  userInfo.displayName === message.sender
                    ? inlineStyles
                    : undefined
                }
                className="chat-info"
                key={message.id}
              >
                <img
                  style={
                    userInfo.displayName === message.sender
                      ? inlineImgStyle
                      : undefined
                  }
                  src={new URL(message.photoUrl, import.meta.url)}
                  alt="fire-logo"
                />

                <span
                  style={
                    userInfo.displayName === message.sender
                      ? inlineSpanStyles
                      : undefined
                  }
                >
                  <p>
                    {userInfo.displayName === message.sender
                      ? "Me"
                      : message.sender}
                  </p>
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={message.timeSent
                      ?.toDate()
                      .toLocaleString()}
                    className="text-container"
                  >
                    {message.text}
                    <Tooltip id="my-tooltip" />
                  </div>
                </span>
              </div>
            ))}
          </ReactScrollableFeed>
        </div>

        <div className="text-area">
          <textarea
            name="chat"
            rows="1"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleEnter}
            ref={messageRef}
          ></textarea>
          <img
            onClick={handleClick}
            src={new URL("../pictures/send.png", import.meta.url)}
            alt="fire-logo"
          />
        </div>
      </div>

      <div className="infosec">
        <section>
          <div className="room-name-container">
            <div className="label-container">
              <h1>Room Name</h1>
            </div>
            <div className="room-name">
              {chosenRoom.map((room) => (
                <h2 key={1}> {room.roomName}</h2>
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="room-members">
            <div className="member-label">
              <h3>Members</h3>
            </div>

           

          </div>
          
        </section>

        <section>
        <div className="member-section">
        {roomMember.map((member) => (
              <div className="member">
              <img
                 src={new URL(member.photoURL, import.meta.url)}
                 alt="fire-logo"
               />
               <p>{member.memberName}</p>
              </div>
              ))}
         
         
         
            </div>

            
        </section>
      </div>
    </div>
  );
}
