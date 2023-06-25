import { useState, createContext, useContext } from "react";
import { NavBar } from "./components/NavBar";
import { SignIn } from "./components/SignIn";
import Cookies from "universal-cookie";
import { Helmet } from "react-helmet";
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
  <Helmet>
        <title>Your Website Title</title>
        <meta name="description" content="Description of your website" />
        <meta property="og:title" content="Your Website Title" />
        <meta property="og:description" content="Description of your website" />
        <meta property="og:image" content="./pictures/website.png" />
      </Helmet>
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
