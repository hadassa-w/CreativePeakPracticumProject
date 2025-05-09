import { useState, useEffect } from "react";
import { Container, Typography, Box, Button, TextField, CircularProgress, Avatar, Divider, Card } from "@mui/material";
import { EditOutlined, SaveOutlined, PersonOutline, EmailOutlined, PhoneOutlined, HomeOutlined, ArrowBackOutlined } from "@mui/icons-material";
import axios from "axios";
import User from "../models/user";
import { useAuth } from "../contexts/authContext";
import AutoSnackbar from "./snackbar";

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
    });
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        phone: ""
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error"
    });
    const { userId } = useAuth();

    // Function to show snackbar message
    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    // Load user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    showSnackbar("Access denied", "error");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `https://creativepeak-api.onrender.com/api/User/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const userData = response.data;
                setUser(userData);
                setFormData({
                    fullName: userData.fullName || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    address: userData.address || ""
                });
            } catch (error) {
                console.error("Error loading user data:", error);
                showSnackbar("Error loading profile", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Basic validation
        validateField(name, value);
    };

    // Field validation function
    const validateField = (name: string, value: string) => {
        let errorMessage = "";

        switch (name) {
            case "fullName":
                errorMessage = !value ? "Full name is required" : "";
                break;
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                errorMessage = !value ? "Email is required" :
                    !emailRegex.test(value) ? "Invalid email address" : "";
                break;
            case "phone":
                const phoneRegex = /^[0-9\+\-\s]{9,15}$/;
                errorMessage = !value ? "Phone number is required" :
                    !phoneRegex.test(value) ? "Invalid phone number" : "";
                break;
        }

        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        return !errorMessage;
    };

    // Check if the entire form is valid
    const isFormValid = () => {
        return !errors.fullName && !errors.email && !errors.phone &&
            formData.fullName && formData.email && formData.phone;
    };

    // Save user data
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields before submission
        if (!validateField("fullName", formData.fullName) ||
            !validateField("email", formData.email) ||
            !validateField("phone", formData.phone)) {
            return;
        }

        setSaving(true);
        const token = localStorage.getItem("token");

        if (!token) {
            showSnackbar("No access permission to save data", "error");
            setSaving(false);
            return;
        }

        try {
            await axios.put(
                `https://creativepeak-api.onrender.com/api/User/updateWithoutPassword/${userId}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUser({ ...user, ...formData } as User);
            showSnackbar("Profile updated successfully! 🎉", "success");

            setTimeout(() => {
                setIsEditing(false);
                setSaving(false);
            }, 1000);
        } catch (error) {
            console.error("Error updating data:", error);
            showSnackbar("Error updating profile", "error");
            setSaving(false);
        }
    };

    // Render loading screen
    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={60} sx={{ color: "#673AB7", mb: 3 }} />
                    <Typography variant="h6" sx={{ color: "#666" }}>Loading user data...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{
                pt: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "80vh"
            }}>
                {/* Profile card */}
                <Card
                    elevation={5}
                    sx={{
                        width: "100%",
                        borderRadius: 4,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        background: "linear-gradient(to bottom, #f9f9ff, #ffffff)",
                        position: "relative"
                    }}
                >
                    {/* Card header */}
                    <Box
                        sx={{
                            height: 150,
                            p: 3,
                            pb: 5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            background: "linear-gradient(145deg, #673AB7 0%, #9c27b0 100%)",
                            position: "relative"
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 50,
                                height: 50,
                                bgcolor: "#fff",
                                color: "#673AB7",
                                fontSize: 40,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                                border: "4px solid #fff",
                                mb: 2
                            }}
                        >
                            {user?.fullName?.charAt(0) || <PersonOutline fontSize="medium" />}
                        </Avatar>
                        <Typography variant="h5" sx={{ color: "white", fontWeight: 600, textTransform: "none" }}>
                            My Profile
                        </Typography>
                    </Box>

                    {/* Card content */}
                    <Box sx={{ p: 4, pt: 3 }}>
                        {isEditing ? (
                            // Edit mode - form
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    {/* Full name */}
                                    <TextField
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        error={!!errors.fullName}
                                        helperText={errors.fullName}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <PersonOutline sx={{ mr: 1, color: "#673AB7" }} />
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&:hover fieldset": { borderColor: "#9c27b0" },
                                                "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                                            }
                                        }}
                                    />

                                    {/* Email */}
                                    <TextField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <EmailOutlined sx={{ mr: 1, color: "#673AB7" }} />
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&:hover fieldset": { borderColor: "#9c27b0" },
                                                "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                                            }
                                        }}
                                    />

                                    {/* Phone */}
                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <PhoneOutlined sx={{ mr: 1, color: "#673AB7" }} />
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&:hover fieldset": { borderColor: "#9c27b0" },
                                                "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                                            }
                                        }}
                                    />

                                    {/* Address */}
                                    <TextField
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <HomeOutlined sx={{ mr: 1, color: "#673AB7" }} />
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&:hover fieldset": { borderColor: "#9c27b0" },
                                                "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                                            }
                                        }}
                                    />

                                    {/* Action buttons */}
                                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => setIsEditing(false)}
                                            startIcon={<ArrowBackOutlined />}
                                            sx={{
                                                borderRadius: 2,
                                                py: 1.2,
                                                flex: 1,
                                                borderColor: "#673AB7",
                                                color: "#673AB7",
                                                "&:hover": {
                                                    borderColor: "#9c27b0",
                                                    bgcolor: "rgba(103, 58, 183, 0.04)"
                                                },
                                                textTransform: "none"
                                            }}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={!isFormValid() || saving}
                                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveOutlined />}
                                            sx={{
                                                borderRadius: 2,
                                                py: 1.2,
                                                flex: 2,
                                                bgcolor: "#673AB7",
                                                color: "white",
                                                boxShadow: "0 4px 10px rgba(103, 58, 183, 0.3)",
                                                "&:hover": {
                                                    bgcolor: "#9c27b0",
                                                    boxShadow: "0 6px 15px rgba(103, 58, 183, 0.4)"
                                                },
                                                textTransform: "none"
                                            }}
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        ) : (
                            // View mode - user details
                            <Box sx={{ py: 1,width:"350px" }}>
                                {/* Full name */}
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box sx={{
                                        bgcolor: "rgba(103, 58, 183, 0.1)",
                                        borderRadius: "50%",
                                        p: 1.5,
                                        display: "flex",
                                        mr: 2
                                    }}>
                                        <PersonOutline sx={{ color: "#673AB7" }} />
                                    </Box>
                                    <Box sx={{textAlign: "left"}}>
                                        <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                                            Full Name
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {user?.fullName}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Email */}
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box sx={{
                                        bgcolor: "rgba(103, 58, 183, 0.1)",
                                        borderRadius: "50%",
                                        p: 1.5,
                                        display: "flex",
                                        mr: 2
                                    }}>
                                        <EmailOutlined sx={{ color: "#673AB7" }} />
                                    </Box>
                                    <Box sx={{textAlign: "left"}}>
                                        <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                                            Email
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {user?.email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Phone */}
                                <Box sx={{ display: "flex", mb: 3, alignItems: "center" }}>
                                    <Box sx={{
                                        bgcolor: "rgba(103, 58, 183, 0.1)",
                                        borderRadius: "50%",
                                        p: 1.5,
                                        display: "flex",
                                        mr: 2
                                    }}>
                                        <PhoneOutlined sx={{ color: "#673AB7" }} />
                                    </Box>
                                    <Box sx={{textAlign: "left"}}>
                                        <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                                            Phone
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {user?.phone}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Address - if exists */}
                                {user?.address && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: "flex", mb: 1, alignItems: "center" }}>
                                            <Box sx={{
                                                bgcolor: "rgba(103, 58, 183, 0.1)",
                                                borderRadius: "50%",
                                                p: 1.5,
                                                display: "flex",
                                                mr: 2
                                            }}>
                                                <HomeOutlined sx={{ color: "#673AB7" }} />
                                            </Box>
                                            <Box sx={{textAlign: "left"}}>
                                                <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                                                    Address
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {user.address}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </>
                                )}

                                {/* Edit button */}
                                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => setIsEditing(true)}
                                        startIcon={<EditOutlined />}
                                        sx={{
                                            borderRadius: 8,
                                            py: 1.2,
                                            px: 4,
                                            bgcolor: "#673AB7",
                                            color: "white",
                                            boxShadow: "0 4px 10px rgba(103, 58, 183, 0.3)",
                                            "&:hover": {
                                                bgcolor: "#9c27b0",
                                                boxShadow: "0 6px 15px rgba(103, 58, 183, 0.4)",
                                                transform: "translateY(-2px)"
                                            },
                                            transition: "all 0.3s ease",
                                            textTransform: "none",
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Box>

            {/* Snackbar notification */}
            <AutoSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </Container>
    );
}