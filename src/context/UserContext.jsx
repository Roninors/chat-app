import Cookies from "universal-cookie";
import { createContext } from "react";
import { useState } from "react";
export const UserContext = createContext();

const MainContextProvider = ({ children }) => {
  const cookies = new Cookies();
  const [currentUser, setCurrentUser] = useState({});
  const [isIn, setIsIn] = useState(false);
  const [isAuth, setAuth] = useState(cookies.get("auth-token"));
  const userInfo = JSON.parse(localStorage.getItem("user"));

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isIn,
        setIsIn,
        isAuth,
        setAuth,
        userInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default MainContextProvider;
