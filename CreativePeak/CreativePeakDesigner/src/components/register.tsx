import { Button, TextField, Box, Typography, IconButton, InputAdornment, CircularProgress, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import axios from "axios";
import { useAuth } from "../contexts/authContext";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import PaletteIcon from "@mui/icons-material/Palette";

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
  maxWidth: "500px",
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

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{ fullname?: string; email?: string; password?: string; phone?: string; address?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      if (name === "password" && value.length < 6) return;
      if (name === "phone" && value.length < 9) return;
      if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) return;
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setFieldErrors({});

    let newFieldErrors: { fullname?: string; email?: string; password?: string; phone?: string } = {};
    let hasError = false;

    if (!formData.fullname.trim()) {
      newFieldErrors.fullname = "Full name is required";
      hasError = true;
    }
    if (!formData.email.trim()) {
      newFieldErrors.email = "Email is required";
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newFieldErrors.email = "Invalid email format";
      hasError = true;
    }
    if (!formData.password.trim()) {
      newFieldErrors.password = "Password is required";
      hasError = true;
    } else if (formData.password.length < 6) {
      newFieldErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }
    if (!formData.phone.trim()) {
      newFieldErrors.phone = "Phone number is required";
      hasError = true;
    } else if (!/^\d{9,}$/.test(formData.phone)) {
      newFieldErrors.phone = "Phone number must be at least 9 digits";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://creativepeak-api.onrender.com/api/Auth/Register", formData);

      if (response.status === 200 && response.data.token) {
        login(response.data.token, response.data.refreshToken, response.data.user.fullName, response.data.user.id);
        navigate("/designerDetails");
      } else {
        setError("Registration failed. Please check your details.");
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.error("Error:", error.response.data.message);
        setFieldErrors((prev) => ({ ...prev, email: error.response.data.message }));
      } else {
        setError("Registration failed. Try again.");
      }
    }

    setLoading(false);
  };

  const isFormValid = () => {
    return (
      formData.fullname.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.phone.trim() !== ""
    );
  };

  // טיפול בלחיצה על Enter כדי להירשם
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isFormValid()) {
      handleRegister();
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
            <PersonAddIcon sx={{ fontSize: 40, color: "#512da8" }} />
          </IconCircle>
          <GradientTitle variant="h4">
            Create Your Account
          </GradientTitle>
        </IconHeader>

        <Typography variant="body1" sx={{ color: "#555", mb: 4, fontSize: "16px" }}>
          Fill in your details to start creating your creative portfolio
        </Typography>

        <Box onKeyPress={handleKeyPress}>
          <StyledTextField
            label="Full Name"
            fullWidth
            required
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            error={!!fieldErrors.fullname}
            helperText={fieldErrors.fullname}
            margin="normal"
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
            label="Email"
            fullWidth
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <StyledTextField
            label="Phone"
            fullWidth
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!fieldErrors.phone}
            helperText={fieldErrors.phone}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <StyledTextField
            label="Address"
            fullWidth
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <StyledTextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            margin="normal"
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
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        {error && (
          <Box sx={{
            p: 2,
            mb: 3,
            backgroundColor: "rgba(244, 67, 54, 0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(244, 67, 54, 0.2)"
          }}>
            <Typography color="error" variant="body2" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
              <Box component="span" sx={{ fontSize: "20px" }}>⚠️</Box>
              {error}
            </Typography>
          </Box>
        )}

        <StyledButton
          variant="contained"
          color="secondary"
          fullWidth
          sx={{
            mt: 3,
            bgcolor: "#512da8",
            "&:hover": {
              bgcolor: "#673AB7",
            }
          }}
          onClick={handleRegister}
          disabled={loading || !isFormValid()}
          startIcon={<PersonAddIcon />}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Registering...
            </>
          ) : (
            "Create Account"
          )}
        </StyledButton>

        <Box sx={{ 
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
          }
        }} />

        <StyledButton
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => navigate("/logIn")}
          disabled={loading}
          startIcon={<LoginIcon />}
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
          Already have an account? Sign In
        </StyledButton>

        <Box sx={{ mt: 4, pt: 2 }}>
          <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
            By signing up, you agree to our <Box component="span" sx={{ color: "#7E57C2", cursor: "pointer", fontWeight: "500" }}>Terms of Service</Box> and <Box component="span" sx={{ color: "#7E57C2", cursor: "pointer", fontWeight: "500" }}>Privacy Policy</Box>
          </Typography>
        </Box>
      </ContentBox>
    </OuterContainer>
  );
}

export default Register;