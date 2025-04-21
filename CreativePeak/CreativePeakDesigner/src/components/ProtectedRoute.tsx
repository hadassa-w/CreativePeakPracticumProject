import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }: { children: any }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
