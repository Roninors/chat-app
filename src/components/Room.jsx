import "../css/room.css";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useState, useRef, useContext, useEffect } from "react";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { UserContext } from "../context/UserContext";

export function Room() {
  const [createRoom, setCreateRoom] = useState(true);
  const [generatedCode, setGeneratedCode] = useState("");
  const [docExists, setDocExists] = useState(false);
  const [roomExists, setRoomExists] = useState(false);
  const [fieldValue, setFieldValue] = useState("");
  const [submitting, setIsSubmitting] = useState(false);
  const roomInput = useRef();
  const enteredRoom = useRef();
  const navigate = useNavigate();
  const { userInfo, setIsIn } = useContext(UserContext);
  const roomRef = collection(db, "rooms");
  const memberCol = collection(db, "roomMembers");

  useEffect(() => {
    const queryMembers = query(
      memberCol,
      where("memberName", "==", userInfo.displayName),
    );

    const queryRoom = query(
      roomRef,
      where("roomCode", "==", enteredRoom.current.value)
    );

    const unsubscribeRoomQuery = onSnapshot(queryRoom, (snapshot) => {
      snapshot.forEach((doc) => {
        console.log({ ...doc.data(), id: doc.id });
      });

      if (snapshot.empty) {
        console.log("empty room");
        setRoomExists(false);
      } else {
        console.log("not empty room");
        setRoomExists(true);
      }
    });

    const unsubscribeMemberQuery = onSnapshot(queryMembers, (snapshot) => {
      snapshot.forEach((doc) => {
        console.log({ ...doc.data(), id: doc.id });
      });

      if (snapshot.empty) {
        console.log("empty members");
        setDocExists(true);
      } else {
        console.log("not empty members");
        setDocExists(false);
      }
    });

    return () => {
      unsubscribeMemberQuery();
      unsubscribeRoomQuery();
    };
  }, [fieldValue]);

  const generateCode = () => {
    const number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let string = "";

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      string += chars.charAt(randomIndex);
    }

    const code = string + number;
    setGeneratedCode(code);
  };

  const addMember = async (code) => {
    await addDoc(memberCol, {
      memberName: userInfo.displayName,
      roomCode: code,
      isTyping: false,
      timeJoined: serverTimestamp(),
      photoURL: userInfo.photoURL,
    });
  };

  console.log(roomExists);
  const handleJoinRoom = async () => {
    if (
      enteredRoom.current.value == "" ||
      /^\s*$/.test(enteredRoom.current.value)
    ) {
      alert("Invalid room");
    } else {
      if (roomExists) {
        localStorage.setItem(
          "joinedCode",
          JSON.stringify(enteredRoom.current.value)
        );
        localStorage.setItem("inRoom", JSON.stringify(true));
        setIsIn(true);
        if (docExists == true) {
          console.log("user not found");
          await addMember(enteredRoom.current.value);
          navigate("/chatPage");
        } else {
          navigate("/chatPage");
          console.log("user found");
        }
      } else {
        alert("Room does not exist");
        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setIsSubmitting(true);

    if (
      roomInput.current.value == "" ||
      /^\s*$/.test(roomInput.current.value)
    ) {
      alert("Enter Room name");
      setIsSubmitting(false);
    } else {
      await addDoc(roomRef, {
        roomCreator: userInfo.displayName,
        roomName: roomInput.current.value,
        roomCode: generatedCode,
        createdAt: serverTimestamp(),
      });

      await addMember(generatedCode);
      localStorage.setItem("joinedCode", JSON.stringify(generatedCode));
      setIsIn(true);
      navigate("/chatPage");
      setIsSubmitting(false);
    }

    e.target.reset();
    generateCode();
  };

  if (createRoom) {
    return (
      <div className="room-container">
        <div className="input-wrapper">
          <ul className="logo">
            <img
              src={new URL("../pictures/fire-logo.png", import.meta.url)}
              alt="fire-logo"
            />
          </ul>
          <ul>
            <button
              className="gen-button"
              onClick={() => {
                generateCode();
                setCreateRoom(false);
              }}
            >
              Create Room
            </button>
          </ul>
          <ul>or</ul>
          <ul>
            <input
              type="text"
              placeholder="Room code"
              ref={enteredRoom}
              onChange={(e) => setFieldValue(e.target.value)}
            />

            <button onClick={handleJoinRoom}>Enter</button>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="room-container">
        <div className="input-wrapper">
          <ul className="logo">
            <img
              src={new URL("../pictures/fire-logo.png", import.meta.url)}
              alt="fire-logo"
            />
          </ul>

          <form onSubmit={handleSubmit}>
            <ul>
              <input type="text" placeholder="Room Name" ref={roomInput} />
            </ul>
            <span className="roomcode-span">
              <ul className="code-label">
                Room Code: {generatedCode}
                <CopyToClipboard text={generatedCode}>
                  <img
                    src={new URL("../pictures/copy.png", import.meta.url)}
                    alt="fire-logo"
                  />
                </CopyToClipboard>
              </ul>
            </span>

            <ul>
              <button className="create-button" type="submit">
                Create
              </button>
              <button
                className="create-button"
                onClick={() => {
                  setCreateRoom(true);
                  setGeneratedCode("");
                }}
              >
                Cancel
              </button>
            </ul>
          </form>
        </div>
      </div>
    );
  }
}
