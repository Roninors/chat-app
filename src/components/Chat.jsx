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
  const roomCol = collection(db,"rooms");
  const { userInfo } = useContext(appContext);
  const [inputText, setInputText] = useState("");
  const joinedCode = JSON.parse(localStorage.getItem("joinedCode"));
  const messageRef = useRef();
  const [messages, setMessages] = useState([]);
  const [chosenRoom,setChosenRoom] = useState([]);

  useEffect(() => {
    const queryMessages = query(
      messageCol,
      where("roomCode", "==", joinedCode),
      orderBy("timeSent")
    );

    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log("get");
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);
  
  useEffect(()=>{
    const queryRooms = query(
      roomCol,
      where("roomCode", "==", joinedCode)
    );

    const unsuscribe = onSnapshot(queryRooms, (snapshot) => {
      let room = [];
      snapshot.forEach((doc) => {
        room.push({ ...doc.data(), id: doc.id });
      });
      
      setChosenRoom(room);
    });

    return () => unsuscribe();

  },[])

  

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
            <div className="room-name" >
            {chosenRoom.map((room)=>(
                <h2 key={1}> { room.roomName }</h2> 
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
      </div>
    </div>
  );
}
