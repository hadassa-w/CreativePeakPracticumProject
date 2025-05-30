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
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import LockResetIcon from "@mui/icons-material/LockReset";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaletteIcon from "@mui/icons-material/Palette";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LoginIcon from "@mui/icons-material/Login";
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

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'email' | 'tempPassword'>('email');
    const [email, setEmail] = useState("");
    const [tempPassword, setTempPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [generalError, setGeneralError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { toLogin } = useAuth();

    const handleSendEmail = async () => {
        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            await axios.post("https://creativepeak-api.onrender.com/api/Auth/forgot-password", {
                email
            });
            setMessage("Temporary password sent! Check your email for the temporary password.");
            setStep('tempPassword');
        } catch (err: any) {
            console.error("Full error:", err);
            if (err.response) {
                setGeneralError("The email address does not exist in the system.");
            } else {
                setGeneralError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTempPasswordSubmit = async () => {
        if (!tempPassword.trim()) {
            setError("Temporary password is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // שלח את הסיסמה הזמנית לשרת לאימות
            const response = await axios.post("https://creativepeak-api.onrender.com/api/Auth/authenticate", {
                email,
                "password": tempPassword
            });

            const token = response.data.accessToken;
            const user = response.data.user;

            toLogin(token, user);
            navigate("/changePassword");
        } catch (err: any) {
            console.error("Full error:", err);
            if (err.response) {
                setError(err.response.data?.message || "Invalid temporary password. Please try again.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            if (step === 'email' && email.trim() !== "") {
                handleSendEmail();
            } else if (step === 'tempPassword' && tempPassword.trim() !== "") {
                handleTempPasswordSubmit();
            }
        }
    };

    const handleBackClick = () => {
        if (step === 'tempPassword') {
            setStep('email');
            setError("");
            setMessage("");
        } else {
            navigate("/login");
        }
    };

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
                        {step === 'email' ? (
                            <LockResetIcon sx={{ fontSize: 40, color: "#512da8" }} />
                        ) : (
                            <VpnKeyIcon sx={{ fontSize: 40, color: "#512da8" }} />
                        )}
                    </IconCircle>
                    <GradientTitle variant="h4">
                        {step === 'email' ? 'Reset Password' : 'Enter Temporary Password'}
                    </GradientTitle>
                </IconHeader>

                {step === 'email' ? (
                    <>
                        <Typography variant="body1" sx={{ color: "#555", mb: 4, fontSize: "16px" }}>
                            Enter the email address registered in the system and we will send you a new temporary password.
                        </Typography>

                        <Box onKeyPress={handleKeyPress}>
                            <StyledTextField
                                label="Email Address"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!error}
                                helperText={error}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3 }}
                            />
                        </Box>

                        {generalError && (
                            <Box sx={{
                                p: 2,
                                mb: 3,
                                backgroundColor: "rgba(244, 67, 54, 0.05)",
                                borderRadius: "8px",
                                border: "1px solid rgba(244, 67, 54, 0.2)"
                            }}>
                                <Typography color="error" variant="body2" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                    <Box component="span" sx={{ fontSize: "20px" }}>⚠️</Box>
                                    {generalError}
                                </Typography>
                            </Box>
                        )}

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
                            onClick={handleSendEmail}
                            disabled={loading || email.trim() === ""}
                            startIcon={<SendIcon />}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                                    Sending...
                                </>
                            ) : (
                                "Send temporary password"
                            )}
                        </StyledButton>
                    </>
                ) : (
                    <>
                        <Typography variant="body1" sx={{ color: "#555", mb: 2, fontSize: "16px" }}>
                            We've sent a temporary password to <strong>{email}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#777", mb: 4, fontSize: "14px" }}>
                            Please check your email and enter the temporary password below
                        </Typography>

                        <Box onKeyPress={handleKeyPress}>
                            <StyledTextField
                                label="Temporary Password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                value={tempPassword}
                                onChange={(e) => setTempPassword(e.target.value)}
                                error={!!error}
                                helperText={error}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon />
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
                            onClick={handleTempPasswordSubmit}
                            disabled={loading || tempPassword.trim() === ""}
                            startIcon={<LoginIcon />}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                                    Verifying...
                                </>
                            ) : (
                                "Login with Temporary Password"
                            )}
                        </StyledButton>
                    </>
                )}

                {message && step === 'email' && (
                    <Box sx={{
                        p: 2,
                        mb: 3,
                        mt: 3,
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
                )}

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
                        onClick={() => navigate("/login")}
                    >
                        ← Back to Sign In
                    </Typography>
                </Box>

                <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(126, 87, 194, 0.1)" }}>
                    <Typography variant="body2" sx={{ color: "#666", fontSize: "12px" }}>
                        Having trouble? Contact our{" "}
                        <Box component="span" sx={{ color: "#7E57C2", cursor: "pointer", fontWeight: "500" }}>
                            support team
                        </Box>
                    </Typography>
                </Box>
            </ContentBox>
        </OuterContainer>
    );
}