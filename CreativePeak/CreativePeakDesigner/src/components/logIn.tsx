import { Button, TextField, Box, Typography, IconButton, InputAdornment, Container, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface LoginProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

// עיצוב
const ContentBox = styled(Container)({
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // 🔴 שגיאות פרטניות לפי שדה
    const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
    // 🔴 שגיאה כללית ללוגין כושל
    const [generalError, setGeneralError] = useState<string>("");
    // 🔄 מצב טעינה לכפתור
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        let newFieldErrors: { username?: string; password?: string } = {};
        let hasError = false;

        // 🔹 ולידציה לשדות ריקים
        if (!username.trim()) {
            newFieldErrors.username = "Username is required";
            hasError = true;
        }
        if (!password.trim()) {
            newFieldErrors.password = "Password is required";
            hasError = true;
        }

        // אם יש שגיאות בסיסיות – נציג אותן ולא נשלח את הבקשה
        if (hasError) {
            setFieldErrors(newFieldErrors);
            setGeneralError(""); // נמחק שגיאה כללית במקרה כזה
            return;
        }

        // 🔄 הפעלת מצב טעינה
        setLoading(true);

        // 🔹 ניסיון התחברות
        try {
            console.log("Sending login request:", { username, password });
            const response = await axios.post("https://creativepeak-api.onrender.com/api/Auth/Login", {
                UserName: username,
                Password: password,
            });

            console.log("Login successful:", response.data);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.user.id);
            localStorage.setItem("userName", response.data.user.fullName);
            setIsLoggedIn(true);

            // 🔹 איפוס שגיאות כי ההתחברות הצליחה
            setFieldErrors({});
            setGeneralError("");
            navigate("/welcome");
        } catch (error) {
            console.error("Login error:", error);

            // 🔴 מציגים שגיאה כללית במקרה של לוגין כושל
            setGeneralError("The username or password is incorrect.");
        } finally {
            // 🔄 כיבוי מצב טעינה
            setLoading(false);
        }
    };

    const isFormValid = () => {
        // בודק אם כל השדות מולאו כראוי
        return username.trim() !== "" && password.trim() !== "";
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "500px", height: "100%", overflow: "hidden", padding: "50px" }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                    🔐 Welcome Back!
                </Typography>

                <Typography variant="body1" sx={{ color: "#444", mb: 3 }}>
                    Please enter your credentials to log in.
                </Typography>

                {/* 🔹 שדה שם משתמש עם שגיאה פרטנית */}
                <TextField
                    label="User name - Email"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!fieldErrors.username}
                    helperText={fieldErrors.username}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircleIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* 🔹 שדה סיסמה עם שגיאה פרטנית */}
                <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* 🔴 הודעת שגיאה כללית במקרה של לוגין כושל */}
                {generalError && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {generalError}
                    </Typography>
                )}

                {/* 🔹 כפתור התחברות עם טעינה */}
                <StyledButton
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleLogin}
                    disabled={loading || !isFormValid()} // נטרול כפתור בזמן הטעינה
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Connecting...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </StyledButton>

                {/* 🔹 מעבר לעמוד הרשמה */}
                <StyledButton variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/register")} disabled={loading}>
                    Not registered? Click here to sign up.
                </StyledButton>
            </ContentBox>
        </Box>
    );
}

export default LogIn;
