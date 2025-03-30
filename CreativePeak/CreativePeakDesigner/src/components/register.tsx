import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, IconButton, InputAdornment, Container, CircularProgress } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/system";
import { AccountCircle, Lock, Phone, Email, Home, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

interface RegisterProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

// עיצוב התיבה המרכזית
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

function Register({ setIsLoggedIn }: RegisterProps) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        phone: "",
        address: "", // לא חובה
    });

    const [fieldErrors, setFieldErrors] = useState<{ fullname?: string; email?: string; password?: string; phone?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // בדיקה אם ניתן להסיר את השגיאה
        if (fieldErrors[name as keyof typeof fieldErrors]) {
            if (name === "password" && value.length < 6) return;
            if (name === "phone" && value.length < 9) return;
            if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) return; // אם האימייל לא בפורמט תקין, נשאיר שגיאה
            setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setError("");
        setFieldErrors({});

        let newFieldErrors: { fullname?: string; email?: string; password?: string; phone?: string } = {};
        let hasError = false;

        // ולידציה  
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

        // ניסיון הרשמה  
        try {
            const response = await axios.post("https://creativepeak-api.onrender.com/api/Auth/Register", formData);

            if (response.status === 200 && response.data.token) {
                console.log("🎉 Registration successful:", response.data);

                setIsLoggedIn(true);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.user.id);
                localStorage.setItem("userName", response.data.user.fullName);

                console.log(response.data.user);

                navigate("/profile");
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
        // בודק אם כל השדות החובה מולאו כראוי
        return (
            formData.fullname.trim() !== "" &&
            formData.email.trim() !== "" &&
            /^\S+@\S+\.\S+$/.test(formData.email) &&
            formData.password.trim() !== "" &&
            formData.password.length >= 6 &&
            formData.phone.trim() !== "" &&
            /^\d{9,}$/.test(formData.phone)
        );
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "500px", height: "100%", overflow: "hidden", minHeight: "100vh", padding: "50px" }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                    🎉 Create Your Account
                </Typography>

                <Typography variant="body1" sx={{ color: "#444", mb: 3 }}>
                    Fill in your details to get started.
                </Typography>

                {[
                    { label: "Full Name", name: "fullname", icon: <AccountCircle /> },
                    { label: "Email", name: "email", icon: <Email /> },
                    { label: "Phone", name: "phone", icon: <Phone /> },
                ].map(({ label, name, icon }) => (
                    <TextField
                        key={name}
                        label={label}
                        fullWidth
                        required
                        name={name}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        error={!!fieldErrors[name as keyof typeof fieldErrors]}
                        helperText={fieldErrors[name as keyof typeof fieldErrors]}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {icon}
                                </InputAdornment>
                            ),
                        }}
                    />
                ))}

                <TextField
                    label="Address"
                    fullWidth
                    name={"address"}
                    value={formData.address}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Home />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock />
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

                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

                <StyledButton variant="contained" color="secondary" fullWidth sx={{ mt: 3 }} onClick={handleRegister} disabled={loading || !isFormValid()}>
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Registering...
                        </>
                    ) : (
                        "Register"
                    )}
                </StyledButton>

                <StyledButton variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/logIn")}>
                    Already registered? Log in here.
                </StyledButton>
            </ContentBox>
        </Box>
    );
}

export default Register;
