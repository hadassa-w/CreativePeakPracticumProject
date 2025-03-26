import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, IconButton, InputAdornment, Container } from "@mui/material";
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

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post("https://creativepeak-api.onrender.com/api/Auth/Register", formData);

            if (response.status === 200 && response.data.token) {
                console.log("🎉 Registration successful:", response.data);

                // שמירת סטטוס התחברות
                setIsLoggedIn(true);
                localStorage.setItem("isLoggedIn", "true");

                // שמירת טוקן מהשרת
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.id);

                navigate("/welcome");
            } else {
                setError("Registration failed. Please check your details.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("The username or password is incorrect. Try again.");
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "450px", height: "100%", overflow: "hidden", marginTop: "50px" }}>
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

                {/* Error Message */}
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

                <StyledButton variant="contained" color="secondary" fullWidth sx={{ mt: 3 }} onClick={handleRegister}>
                    Register
                </StyledButton>

                <StyledButton variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/logIn")}>
                    Already registered? Log in here.
                </StyledButton>
            </ContentBox>
        </Box>
    );
}

export default Register;
