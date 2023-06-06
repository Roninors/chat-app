import { useState, createContext, useContext } from "react";
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
import {  UserContext} from "./context/UserContext";

function App() {
const {isAuth,isIn} = useContext(UserContext);

  return (
    <>
  
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

    </>
  );
}

export default App;
