import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import axios from "axios";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  // refreshToken: string | null;
  userName: string | null;
  userId: number | null;
  login: (token: string, userName: string, userId: number) => void;
  logout: () => void;
  isLoading: boolean;
  // refreshAuthToken: () => void; // פונקציה לריענון הטוקן
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  // refreshToken: null,
  userName: null,
  userId: null,
  login: () => { },
  logout: () => { },
  isLoading: true,
  // refreshAuthToken: () => { }, // ברירת מחדל
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  // const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  // פונקציה לריענון טוקן
  // const refreshAuthToken = async () => {
  //   const storedToken = localStorage.getItem("token");
  //   const storedRefreshToken = localStorage.getItem("refreshToken");
  
  //   if (!storedToken || !storedRefreshToken) return;
  
  //   try {
  //     const response = await axios.post("https://creativepeak-api.onrender.com/api/Auth/Refresh-token", {
  //       accessToken: storedToken,
  //       refreshToken: storedRefreshToken,
  //     });
  
  //     const newAccessToken = response.data.accessToken;
  //     const newRefreshToken = response.data.refreshToken;
  
  //     // const expirationTime = Date.now() + 15 * 60 * 1000; // 15 דקות קדימה
  
  //     localStorage.setItem("token", newAccessToken);
  //     localStorage.setItem("refreshToken", newRefreshToken);
  //     // localStorage.setItem("tokenExpirationTime", expirationTime.toString());
  
  //     setToken(newAccessToken);
  //     setRefreshToken(newRefreshToken);
  //   } catch (error) {
  //     console.error("❌ Error refreshing token:", error);
  //     // logout(); // אם רוצים לנתק את המשתמש
  //   }
  // };
  
  useEffect(() => {
    // שחזור הנתונים מ-localStorage
    const storedToken = localStorage.getItem("token");
    // const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUserName = localStorage.getItem("userName");
    const storedUserIdStr = localStorage.getItem("userId");

    if (storedToken && storedUserName && storedUserIdStr) {
      const storedUserId = parseInt(storedUserIdStr, 10);
      setToken(storedToken);
      // setRefreshToken(storedRefreshToken);
      setUserName(storedUserName);
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }

    setIsLoading(false); // סימון שטעינת הנתונים הסתיימה
  }, []);

  const login = (token: string, userName: string, userId: number) => {
    localStorage.setItem("token", token);
    // localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId.toString());
    setToken(token);
    // setRefreshToken(refreshToken);
    setUserName(userName);
    setUserId(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("userId");
    setToken(null);
    // setRefreshToken(null);
    setUserName(null);
    setUserId(null);
    setIsLoggedIn(false);


  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        // refreshToken,
        userName,
        userId,
        login,
        logout,
        isLoading,
        // refreshAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
