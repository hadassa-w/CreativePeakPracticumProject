import { Button, TextField, Box, Typography, IconButton, InputAdornment, Container } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // אייקון משתמש
import LockIcon from "@mui/icons-material/Lock"; // אייקון סיסמה
import Visibility from "@mui/icons-material/Visibility"; // אייקון הצגת סיסמה
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // אייקון הסתרת סיסמה

interface LoginProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

// עיצוב תיבה מרכזית עם רקע שקוף
const ContentBox = styled(Container)({
    backgroundColor: "rgba(255, 255, 255, 0.85)", // רקע חצי שקוף
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // הוספת צל לעיצוב מקצועי
});

const StyledButton = styled(Button)({
    textTransform: "none",
    fontSize: "15px",
    fontWeight: "bold",
    borderRadius: "10px",
    padding: "10px 20px",
    transition: "0.3s",
    "&:hover": {
        transform: "scale(1.05)",
    },
});

function LogIn({ setIsLoggedIn }: LoginProps) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        const requestData = { UserName: username, Password: password };

        try {
            console.log("Sending login request with:", { username, password });
            const response = await axios.post("http://localhost:8080/api/user/login", requestData);

            console.log("Received response:", response);
            if (response.status === 200) {
                const user = response.data;
                console.log("Login successful:", user);
                setIsLoggedIn(true);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userId", user.id);
                navigate("/home");
            } else {
                console.log("Login failed with status:", response.status);
                setError("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("The username or password is incorrect. Try again.");
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box sx={{
            display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "450px", height: "100%", overflow: "hidden",
        }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                    🔐 Welcome Back!
                </Typography>

                <Typography variant="body1" sx={{ color: "#444", mb: 3 }}>
                    Please enter your credentials to log in.
                </Typography>

                {/* Username Field */}
                <TextField
                    label="User name"
                    required
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircleIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Password Field */}
                <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Error Message */}
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

                {/* Sign In Button */}
                <StyledButton
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleLogin}
                >
                    Sign In
                </StyledButton>

                {/* Register Button */}
                <StyledButton
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleRegister}
                >
                    Not registered? Click here to sign up.
                </StyledButton>
            </ContentBox>
        </Box>
    );
}

export default LogIn;
