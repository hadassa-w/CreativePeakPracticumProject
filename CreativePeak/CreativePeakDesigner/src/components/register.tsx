import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, IconButton, InputAdornment, Container } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/system";
import { AccountCircle, Lock, Person, Phone, Email, Badge, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

interface RegisterProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

// עיצוב מרכזי של התיבה
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
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        phone: "",
        email: "",
        tz: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            console.log("Sending registration request with:", formData);
            const response = await axios.post("http://localhost:8080/api/user/sighin", formData);
            console.log("Received response:", response);

            if (response.status === 200) {
                console.log("Registration successful:", response.data);
                setIsLoggedIn(true);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userId", response.data.id);
                navigate("/home");
            } else {
                setError("Registration failed. Please check your details.");
            }
        } catch (error) {
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

                {/* שדות הקלט */}
                {[
                    { label: "User Name", name: "username", icon: <AccountCircle /> },
                    { label: "Full Name", name: "name", icon: <Person /> },
                    { label: "Phone", name: "phone", icon: <Phone /> },
                    { label: "Email", name: "email", icon: <Email /> },
                    { label: "ID Number", name: "tz", icon: <Badge /> },
                ].map(({ label, name, icon }) => (
                    <TextField
                        key={name}
                        label={label}
                        required
                        fullWidth
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

                {/* Password Field */}
                <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    fullWidth
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

                {/* Buttons */}
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
