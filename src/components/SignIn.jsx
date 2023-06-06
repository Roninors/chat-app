import "../css/signIn.css";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

export function SignIn() {
  const cookies = new Cookies();

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      localStorage.setItem("user", JSON.stringify(result.user));
      window.location.reload();
      
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="signin-div">
      <div className="auth-container">
        <img
          src={new URL("../pictures/fire-logo.png", import.meta.url)}
          alt="fire-logo"
        />

        <p>Connect with flame talk now!</p>

        <button onClick={signIn}>
          <img
            src={new URL("../pictures/google.jpg", import.meta.url)}
            alt="fire-logo"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
