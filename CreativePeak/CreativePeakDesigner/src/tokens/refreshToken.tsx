import { useEffect } from "react";
import { useAuth } from "../contexts/authContext";

const TokenRefresher = () => {
  const { token, refreshAuthToken } = useAuth();

  useEffect(() => {
    if (token) {
      // const tokenExpirationTime = localStorage.getItem("tokenExpirationTime");

      // מרעננים את הטוקן אם הזמן הנותר לטוקן פג
      // if (tokenExpirationTime && Date.now() > parseInt(tokenExpirationTime, 10)) {
        refreshAuthToken(); // פונקציית ריענון הטוקן
      // }
    }
  }, [token, refreshAuthToken]);

  return null;
};

export default TokenRefresher;
