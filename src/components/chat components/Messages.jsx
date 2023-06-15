import "../../css/chat.css";
import { Tooltip } from "react-tooltip";

export function Messages({messages,userInfo,inlineStyles,inlineSpanStyles,inlineImgStyle}) {
  return (
    <div>
      {messages.map((message) => (
        <div
          style={
            userInfo.displayName === message.sender ? inlineStyles : undefined
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
              {userInfo.displayName === message.sender ? "Me" : message.sender}
            </p>
            <div
              data-tooltip-id="my-tooltip"
              data-tooltip-content={message.timeSent?.toDate().toLocaleString()}
              className="text-container"
            >
              {message.text}
              <Tooltip id="my-tooltip" />
            </div>
          </span>
        </div>
      ))}
    </div>
  );
}
