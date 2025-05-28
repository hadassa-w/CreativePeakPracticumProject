import { useState } from "react";
import {
    Button,
    TextField,
    Typography,
    CircularProgress,
    Paper,
    Box,
    InputAdornment,
    IconButton
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaletteIcon from "@mui/icons-material/Palette";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../contexts/authContext";

const OuterContainer = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    position: "relative",
});

const ContentBox = styled(Paper)({
    backgroundColor: "#fcfaff",
    borderRadius: "16px",
    padding: "40px 30px",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    boxShadow: "0px 8px 30px rgba(81, 45, 168, 0.12)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "4px",
        background: "linear-gradient(90deg, #7E57C2, #512da8)",
    }
});

const StyledButton = styled(Button)({
    textTransform: "none",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "100px",
    padding: "12px 20px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 6px 15px rgba(81, 45, 168, 0.15)",
    },
    "& .MuiSvgIcon-root": {
        fontSize: "20px",
        transition: "transform 0.3s ease",
    },
    "&:hover .MuiSvgIcon-root": {
        transform: "scale(1.2)",
    }
});

const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7E57C2",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#512da8",
            borderWidth: "2px",
        },
    },
    "& .MuiInputLabel-root": {
        "&.Mui-focused": {
            color: "#512da8",
        },
    },
    "& .MuiInputAdornment-root": {
        "& .MuiSvgIcon-root": {
            color: "#7E57C2",
        },
    },
});

const IconHeader = styled(Box)({
    position: "relative",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});

const IconCircle = styled(Box)({
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "rgba(126, 87, 194, 0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "15px",
    position: "relative",
    "&::after": {
        content: '""',
        position: "absolute",
        top: "-5px",
        left: "-5px",
        right: "-5px",
        bottom: "-5px",
        borderRadius: "50%",
        border: "2px dashed rgba(126, 87, 194, 0.3)",
        animation: "spin 15s linear infinite",
    },
    "@keyframes spin": {
        "0%": {
            transform: "rotate(0deg)",
        },
        "100%": {
            transform: "rotate(360deg)",
        },
    },
});

const GradientTitle = styled(Typography)({
    position: "relative",
    display: "inline-block",
    fontWeight: "bold",
    color: "#512da8",
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: "-6px",
        left: "10%",
        width: "80%",
        height: "3px",
        background: "linear-gradient(90deg, #7E57C2, #9575CD)",
        borderRadius: "2px",
    }
});

const BackButton = styled(IconButton)({
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "#7E57C2",
    backgroundColor: "rgba(126, 87, 194, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: "rgba(126, 87, 194, 0.2)",
        transform: "translateX(-3px)",
    }
});

export default function ChangePassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);
    const { newLogin } = useAuth();
    const userEmail = localStorage.getItem("userEmail");

    const validatePasswords = () => {
        if (!password.trim()) {
            setError("Password is required");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }

        if (!confirmPassword.trim()) {
            setError("Please confirm your password");
            return false;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        console.log(userEmail, password, confirmPassword);
        if (!validatePasswords()) {
            return;
        }

        if (!userEmail) {
            setError("Email not found. Please log in again.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            await axios.post("https://creativepeak-api.onrender.com/api/Auth/change-password", {
                email: userEmail,
                newPassword: password
            });

            newLogin();
            setSuccess(true);
            setMessage("Password changed successfully! Redirecting to login...");

            // מחכה 2 שניות ואז מנתק ומעביר לדף התחברות
            setTimeout(() => {
                navigate("/welcome");
            }, 5000);

        } catch (err: any) {
            console.error("Full error:", err);
            if (err.response) {
                console.log("Server response:", err.response.data);
                setError(err.response.data?.message || "Something went wrong. Please try again.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && password.trim() !== "" && confirmPassword.trim() !== "") {
            handleChangePassword();
        }
    };

    const handleBackClick = () => {
        navigate("/");
    };

    if (success) {
        return (
            <OuterContainer>
                <ContentBox>
                    <IconHeader>
                        <IconCircle>
                            <CheckCircleIcon sx={{ fontSize: 40, color: "#4CAF50" }} />
                        </IconCircle>
                        <GradientTitle variant="h4">
                            Success!
                        </GradientTitle>
                    </IconHeader>

                    <Typography variant="body1" sx={{ color: "#555", mb: 4, fontSize: "16px" }}>
                        Your password has been changed successfully.
                    </Typography>

                    <Box sx={{
                        p: 2,
                        backgroundColor: "rgba(76, 175, 80, 0.05)",
                        borderRadius: "8px",
                        border: "1px solid rgba(76, 175, 80, 0.2)"
                    }}>
                        <Typography sx={{
                            color: "#2E7D32",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            fontSize: "14px"
                        }}>
                            <Box component="span" sx={{ fontSize: "20px" }}>✅</Box>
                            {message}
                        </Typography>
                    </Box>
                </ContentBox>
            </OuterContainer>
        );
    }

    return (
        <OuterContainer>
            {/* Background decorative elements */}
            <Box sx={{
                position: "absolute",
                top: "10%",
                left: "15%",
                color: "#7E57C2",
                opacity: 0.03,
                fontSize: "180px",
                transform: "rotate(-15deg)",
                display: { xs: "none", lg: "block" }
            }}>
                <PaletteIcon sx={{ fontSize: "inherit" }} />
            </Box>

            <Box sx={{
                position: "absolute",
                bottom: "10%",
                right: "15%",
                color: "#7E57C2",
                opacity: 0.03,
                fontSize: "180px",
                transform: "rotate(15deg)",
                display: { xs: "none", lg: "block" }
            }}>
                <PaletteIcon sx={{ fontSize: "inherit" }} />
            </Box>

            <ContentBox>
                <BackButton onClick={handleBackClick}>
                    <ArrowBackIcon />
                </BackButton>

                <IconHeader>
                    <IconCircle>
                        <SecurityIcon sx={{ fontSize: 40, color: "#512da8" }} />
                    </IconCircle>
                    <GradientTitle variant="h4">
                        Change Password
                    </GradientTitle>
                </IconHeader>

                <Typography variant="body1" sx={{ color: "#555", mb: 4, fontSize: "16px" }}>
                    Please enter your new password and confirm it below.
                </Typography>

                <Box onKeyPress={handleKeyPress}>
                    <StyledTextField
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!error && (error.includes("Password") || error.includes("match"))}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: "#7E57C2" }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />

                    <StyledTextField
                        label="Confirm New Password"
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!error}
                        helperText={error}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        sx={{ color: "#7E57C2" }}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 3 }}
                    />
                </Box>

                <StyledButton
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{
                        mt: 1,
                        bgcolor: "#512da8",
                        "&:hover": {
                            bgcolor: "#673AB7",
                        }
                    }}
                    onClick={handleChangePassword}
                    disabled={loading || password.trim() === "" || confirmPassword.trim() === ""}
                    startIcon={<SaveIcon />}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                            Changing Password...
                        </>
                    ) : (
                        "Change Password"
                    )}
                </StyledButton>

                <Box sx={{ mt: 3 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#7E57C2",
                            cursor: "pointer",
                            fontWeight: "500",
                            "&:hover": {
                                textDecoration: "underline",
                            }
                        }}
                        onClick={handleBackClick}
                    >
                        ← Cancel
                    </Typography>
                </Box>

                <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(126, 87, 194, 0.1)" }}>
                    <Typography variant="body2" sx={{ color: "#666", fontSize: "12px" }}>
                        Make sure to choose a strong password with at least 6 characters
                    </Typography>
                </Box>
            </ContentBox>
        </OuterContainer>
    );
}