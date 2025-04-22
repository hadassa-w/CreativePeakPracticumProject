import { useEffect } from "react";
import { useAuth } from "../contexts/authContext";

const TokenRefresher = () => {
  const { token, refreshAuthToken } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      const tokenExpirationTime = localStorage.getItem("tokenExpirationTime");

      if (token && tokenExpirationTime && Date.now() > parseInt(tokenExpirationTime, 10)) {
        console.log("🔄 Token expired, refreshing...");
        refreshAuthToken();
      }
    }, 60 * 1000); // בדיקה כל דקה

    return () => clearInterval(interval);
  }, [token, refreshAuthToken]);

  return null;
};

export default TokenRefresher;
