// import { useEffect } from "react";
// import { useAuth } from "../contexts/authContext";

// const TokenRefresher: React.FC = () => {
//   const { refreshAuthToken } = useAuth();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // const expirationTimeStr = localStorage.getItem("tokenExpirationTime");
//       // if (!expirationTimeStr) return;

//       // const expirationTime = parseInt(expirationTimeStr, 10);
//       // const timeLeft = expirationTime - Date.now();

//       // if (timeLeft < 60 * 1000) {
//       //   refreshAuthToken();
//       // }
//     }, 30 * 1000);

//     return () => clearInterval(interval);
//   }, [refreshAuthToken]);

//   return null;
// };

// export default TokenRefresher;


const TokenRefresher = () => {

}
export default TokenRefresher;
