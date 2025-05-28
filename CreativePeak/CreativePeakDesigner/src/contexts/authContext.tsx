import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import User from "../models/user";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  userName: string | null;
  userEmail: string | null;
  userId: number | null;
  toLogin: (token: string, user: User) => void;
  newLogin: () => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  userName: null,
  userEmail: null,
  userId: null,
  toLogin: () => { },
  newLogin: () => { },
  login: () => { },
  logout: () => { },
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenExpired = (token: string): boolean => {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const expiry = payload.exp;

      return Date.now() >= expiry * 1000;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return true; // אם יש שגיאה, עדיף להניח שהטוקן לא תקף
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");
    const storedUserIdStr = localStorage.getItem("userId");

    if (storedToken && storedUserName && storedUserIdStr) {
      const tokenExpired = isTokenExpired(storedToken);

      if (tokenExpired) {
        logout();
      } else {
        const storedUserId = parseInt(storedUserIdStr, 10);
        setToken(storedToken);
        setUserName(storedUserName);
        setUserId(storedUserId);
      }
    }

    setIsLoading(false);
  }, []);

  const toLogin = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", user.fullName);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userId", user.id.toString());

    setToken(token);
    setUserName(user.fullName);
    setUserEmail(user.email);
    setUserId(user.id);
  };

  const newLogin = () => {
    localStorage.removeItem("userEmail");
    setIsLoggedIn(true);
  };

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", user.fullName);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userId", user.id.toString());
    setToken(token);
    setUserName(userName);
    setUserEmail(userEmail);
    setUserId(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    setToken(null);
    setUserName(null);
    setUserEmail(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userName,
        userEmail,
        userId,
        toLogin,
        newLogin,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
