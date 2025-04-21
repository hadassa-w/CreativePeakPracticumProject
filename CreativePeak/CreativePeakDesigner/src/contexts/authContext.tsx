import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  userName: string | null;
  userId: number | null;
  login: (token: string, userName: string, userId: number) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  userName: null,
  userId: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");
    const storedUserIdStr = localStorage.getItem("userId");

    if (storedToken && storedUserName && storedUserIdStr) {
      const parsedUserId = parseInt(storedUserIdStr, 10);
      if (!isNaN(parsedUserId)) {
        setToken(storedToken);
        setUserName(storedUserName);
        setUserId(parsedUserId);
        setIsLoggedIn(true);
      }
    }

    setIsLoading(false); // סימון שטעינת הנתונים הסתיימה
  }, []);

  const login = (token: string, userName: string, userId: number) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId.toString());
    setToken(token);
    setUserName(userName);
    setUserId(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setToken(null);
    setUserName(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userName,
        userId,
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
