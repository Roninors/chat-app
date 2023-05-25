import "../css/navBar.css";
import { useContext } from "react";
import { appContext } from "../App";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import Cookies from "universal-cookie";
export function NavBar() {
  const cookies = new Cookies();
  const {isAuth} = useContext(appContext);
  return (
    <nav className="nav-bar">
      <div className="header">
        <ul className="title">
          <img
            src={new URL("../pictures/fire-logo.png", import.meta.url)}
            alt="fire-logo"
          />
          <h1>FlameTalk</h1>
        </ul>
        <ul>
        {isAuth&&<img onClick={async()=>{
            await signOut(auth);
            cookies.remove("auth-token");
            localStorage.removeItem('user');
            localStorage.removeItem('joinedCode');
            window.location.reload();
        }}
            src={new URL("../pictures/out.png", import.meta.url)}
            alt="fire-logo"
          />}


        </ul>
      </div>
    </nav>
  );
}
