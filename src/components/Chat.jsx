import { useContext, useEffect, useRef, useState } from "react";
import "../css/chat.css";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase-config";
import { Tooltip } from "react-tooltip";
import ReactScrollableFeed from "react-scrollable-feed";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { UserContext } from "../context/UserContext";
import { Messages } from "./chat components/Messages";

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
  const memberCol = collection(db, "roomMembers");
  const { userInfo, setIsIn } = useContext(UserContext);
  const [inputText, setInputText] = useState("");
  const joinedCode = JSON.parse(localStorage.getItem("joinedCode"));
  const messageRef = useRef();
  const [messages, setMessages] = useState([]);
  const [chosenRoom, setChosenRoom] = useState([]);
  const [roomMember, setRoomMember] = useState([]);
  const [chosenMember, setChosenMember] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    const queryMessages = query(
      messageCol,
      where("roomCode", "==", joinedCode),
      orderBy("timeSent")
    );

    const queryRooms = query(roomCol, where("roomCode", "==", joinedCode));

    const queryRoomMembers = query(
      memberCol,
      where("roomCode", "==", joinedCode),
      orderBy("timeJoined")
    );

    const queryChosenMember = query(
      memberCol,
      where("memberName", "==", userInfo.displayName),
      where("roomCode", "==", joinedCode)
    );

    const unsubscribeChosenMember = onSnapshot(
      queryChosenMember,
      (snapshot) => {
        let member = [];
        snapshot.forEach((doc) => {
          member.push({ ...doc.data(), id: doc.id });
        });
        console.log("get chosen member");
        setChosenMember(member);
      }
    );

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

    const unsubscribeMembers = onSnapshot(queryRoomMembers, (snapshot) => {
      let members = [];
      snapshot.forEach((doc) => {
        members.push({ ...doc.data(), id: doc.id });
      });
      console.log("get members");

      setRoomMember(members);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeMessages();
      unsubscribeRooms();
      unsubscribeChosenMember();
    };
  }, []);

  const typingUpdate = async (isTyping) => {
    const memberRef = doc(db, "roomMembers", chosenMember[0].id);

    try {
      await updateDoc(memberRef, {
        isTyping,
      });
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

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
            <div className="convo-start-label">
              <img
                src={new URL("../pictures/fire-logo.png", import.meta.url)}
                alt="fire-logo"
              />
              <h1>Conversation starts here</h1>
            </div>

            <Messages
              messages={messages}
              inlineImgStyle={inlineImgStyle}
              inlineSpanStyles={inlineSpanStyles}
              inlineStyles={inlineStyles}
              userInfo={userInfo}
            />

            {roomMember.map((member) => {
              if (
                member.isTyping === true &&
                member.memberName !== userInfo.displayName
              ) {
                return (
                  <div className="typing-div">
                    <p className="typing-indicator">Someone is typing ...</p>;
                  </div>
                );
              } else {
                return "";
              }
            })}
          </ReactScrollableFeed>
        </div>

        <div className="text-area">
          <textarea
            name="chat"
            rows={1}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            onFocus={() => typingUpdate(true)}
            onBlur={() => typingUpdate(false)}
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
            <CopyToClipboard text={joinedCode}>
              <div
                className="room-name"
                data-tooltip-id="roomcode-tooltip"
                data-tooltip-content={joinedCode}
              >
                {chosenRoom.map((room) => (
                  <h2 key={Math.random()}>
                    {" "}
                    {room.roomName} <Tooltip id="roomcode-tooltip" />
                  </h2>
                ))}
              </div>
            </CopyToClipboard>
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
              <div className="member" key={Math.random()}>
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
