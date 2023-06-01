import { useState, createContext } from "react";
import { NavBar } from "./components/NavBar";
import { SignIn } from "./components/SignIn";
import Cookies from "universal-cookie";
import { Room } from "./components/Room";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Chat } from "./components/Chat";
export const appContext = createContext();
function App() {
  const cookies = new Cookies();  

  const [currentUser, setCurrentUser] = useState({});
  const [isIn, setIsIn] = useState(JSON.parse(localStorage.getItem("inRoom")));
  const [isAuth, setAuth] = useState(cookies.get("auth-token"));
  
  const userInfo = JSON.parse(localStorage.getItem('user'));
  return (
    <>
      <appContext.Provider value={{ isAuth, currentUser, setCurrentUser , userInfo,setIsIn}}>
        <Router>
          <NavBar />
          <Routes>
            {!isAuth && <Route path="/" exact element={<SignIn />} />}
            {isAuth && <Route path="/" exact element={<Room />} />}
            {isAuth && isIn && <Route path="/chatPage" exact element={<Chat />} />}
            <Route
              path="/chatPage"
              exact
              element={<Navigate replace to="/" />}
            />
          </Routes>
        </Router>
      </appContext.Provider>
    </>
  );
}

export default App;
