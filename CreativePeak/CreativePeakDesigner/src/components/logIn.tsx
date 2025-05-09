import { Button, TextField, Box, Typography, IconButton, InputAdornment, CircularProgress, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaletteIcon from "@mui/icons-material/Palette";
import { useAuth } from "../contexts/authContext";

// עיצוב קונטיינר חיצוני - משופר
const OuterContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  position: "relative",
});

// עיצוב קונטיינר פנימי - משופר
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

// כפתור מעוצב - משודרג
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

// שדה טקסט מעוצב
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

// חלק אייקון עליון
const IconHeader = styled(Box)({
  position: "relative",
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

// מעגל אייקון
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

// קו מפריד
const Divider = styled(Box)({
  height: "1px",
  width: "80%",
  backgroundColor: "rgba(126, 87, 194, 0.15)",
  margin: "25px auto",
  position: "relative",
  "&::after": {
    content: '"or"',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fcfaff",
    padding: "0 16px",
    color: "#666",
    fontSize: "14px",
  },
});

// כותרת עם אפקט מודגש
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

function LogIn() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    let newFieldErrors: { username?: string; password?: string } = {};
    let hasError = false;

    if (!username.trim()) {
      newFieldErrors.username = "Username is required";
      hasError = true;
    }
    if (!password.trim()) {
      newFieldErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      setGeneralError("");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://creativepeak-api.onrender.com/api/Auth/Login", {
        UserName: username,
        Password: password,
      });

      const token = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const userId = response.data.user.id;
      const fullName = response.data.user.fullName;

      login(token, refreshToken, fullName, userId);

      setFieldErrors({});
      setGeneralError("");
      navigate("/welcome");
    } catch (error) {
      console.error("Login error:", error);
      setGeneralError("The username or password is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  // טיפול בלחיצה על Enter כדי להתחבר
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && username.trim() !== "" && password.trim() !== "") {
      handleLogin();
    }
  };

  return (
    <OuterContainer>
      {/* אלמנטים עיצוביים ברקע */}
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
        <IconHeader>
          <IconCircle>
            <LoginIcon sx={{ fontSize: 40, color: "#512da8" }} />
          </IconCircle>
          <GradientTitle variant="h4">
            Welcome Back!
          </GradientTitle>
        </IconHeader>

        <Typography variant="body1" sx={{ color: "#555", mb: 4, fontSize: "16px" }}>
          Please enter your credentials to access your creative portfolio
        </Typography>

        <Box onKeyPress={handleKeyPress}>
          <StyledTextField
            label="Username - Email"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!fieldErrors.username}
            helperText={fieldErrors.username}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <StyledTextField
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
          />
        </Box>

        <Box sx={{ textAlign: "right", mt: 1, mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#7E57C2",
              cursor: "pointer",
              display: "inline-block",
              fontWeight: "500",
              "&:hover": {
                textDecoration: "underline",
              }
            }}
          >
            Forgot password?
          </Typography>
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
          onClick={handleLogin}
          disabled={loading || username.trim() === "" || password.trim() === ""}
          startIcon={<LoginIcon />}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </StyledButton>

        <Divider />

        <StyledButton
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => navigate("/register")}
          disabled={loading}
          startIcon={<PersonAddIcon />}
          sx={{
            borderColor: "#7E57C2",
            color: "#7E57C2",
            "&:hover": {
              borderColor: "#512da8",
              color: "#512da8",
              bgcolor: "rgba(126, 87, 194, 0.05)",
            }
          }}
        >
          Create New Account
        </StyledButton>

        <Box sx={{ mt: 4, pt: 2 }}>
          <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
            By signing in, you agree to our <Box component="span" sx={{ color: "#7E57C2", cursor: "pointer", fontWeight: "500" }}>Terms of Service</Box> and <Box component="span" sx={{ color: "#7E57C2", cursor: "pointer", fontWeight: "500" }}>Privacy Policy</Box>
          </Typography>
        </Box>
      </ContentBox>
    </OuterContainer>
  );
}

export default LogIn;