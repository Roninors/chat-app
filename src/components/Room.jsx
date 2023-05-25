import "../css/room.css";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState, useRef, useContext } from "react";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { appContext } from "../App";
export function Room() {
  const [createRoom, setCreateRoom] = useState(true);
  const [generatedCode, setGeneratedCode] = useState("");
  const enteredRoom = useRef();
  const { userInfo } = useContext(appContext);

  const roomInput = useRef();
  const roomRef = collection(db, "rooms");
  const navigate = useNavigate();

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

  const handleJoinRoom = () => {
    localStorage.setItem("joinedCode", JSON.stringify(enteredRoom.current.value));

    navigate("/chatPage");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (roomInput.current.value == "") {
      alert("Enter Room name");
    } else {
      await addDoc(roomRef, {
        roomCreator: userInfo.displayName,
        roomName: roomInput.current.value,
        roomCode: generatedCode,
        createdAt: serverTimestamp(),
      });
      localStorage.setItem("joinedCode", JSON.stringify(generatedCode));

      navigate("/chatPage");
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
            <input type="text" placeholder="Enter Room" ref={enteredRoom} />

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

            <ul className="code-label">Room Code: {generatedCode}</ul>
            <ul>
              <button
                className="create-button"
                onClick={() => {
                  setCreateRoom(true);
                  setGeneratedCode("");
                }}
              >
                Cancel
              </button>

              <button className="create-button" type="submit">
                Create
              </button>
            </ul>
          </form>
        </div>
      </div>
    );
  }
}
