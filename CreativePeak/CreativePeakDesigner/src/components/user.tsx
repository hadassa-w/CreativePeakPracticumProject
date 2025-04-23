import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, TextField, Box, Typography, Container, CircularProgress, Paper } from "@mui/material";
import { styled } from "@mui/system";
import User from "../models/user";
import { useAuth } from "../contexts/authContext";
import AutoSnackbar from "./snackbar";

// עיצוב
const ContentBox = styled(Container)({
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
});

const StyledButton = styled(Button)({
    textTransform: "none",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "10px",
    padding: "10px 20px",
    transition: "0.3s",
    "&:hover": {
        transform: "scale(1.05)",
    },
});

const ProfileContainer = styled(Paper)({
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    maxWidth: "500px",
    margin: "auto",
    textAlign: "center",
});

const Label = styled(Typography)({
    fontSize: "25px",
    fontWeight: "600",
    color: "#673AB7",
    display: "flex",
    alignItems: "center",
    gap: "8px",
});

const Value = styled(Typography)({
    fontSize: "20px",
    fontWeight: "500",
    color: "#333",
});

const InfoText = styled(Typography)({
    fontSize: "18px",
    fontWeight: "500",
    color: "#444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "12px",
});

export default function EditUserForm() {
    const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<User>({
        mode: "onChange",
    });

    const [loadingInitial, setLoadingInitial] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const { userId } = useAuth();

    useEffect(() => {
        // refreshAuthToken();
        const token = localStorage.getItem("token");
        axios.get(`https://creativepeak-api.onrender.com/api/User/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const data = response.data;
                setUser(data);
                Object.keys(data).forEach(key => setValue(key as keyof User, data[key as keyof User]));
            })
            .catch(error => console.error("Error fetching user data", error))
            .finally(() => setLoadingInitial(false));
    }, [userId, setValue]);

    const onSubmit = async (data: User) => {
        setSaving(true);
        const token = localStorage.getItem("token");

        if (!token) {
            setSnackbarMessage("⚠️ Authentication token is missing!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setSaving(false);
            return;
        }

        try {
            await axios.put(
                `https://creativepeak-api.onrender.com/api/User/updateWithoutPassword/${userId}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(data);
            setSnackbarMessage("🎉 Details updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            setTimeout(() => {
                setIsEditing(false);
            }, 1000);
        } catch (error) {
            console.error("❌ Error updating data:", error);
            setSnackbarMessage("❌ Failed to update details.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>✏️ Profile</Typography>
                {loadingInitial ? (
                    <CircularProgress sx={{ color: "grey" }} />
                ) : isEditing || !user ? (
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <TextField label="Full Name" {...register("fullName", { required: "Full Name is required" })} fullWidth error={!!errors.fullName} helperText={errors.fullName?.message?.toString()} required />
                        <TextField label="Email" type="email" {...register("email", { required: "Email is required" })} fullWidth error={!!errors.email} helperText={errors.email?.message?.toString()} required />
                        <TextField label="Phone" type="tel" {...register("phone", { required: "Phone is required" })} fullWidth error={!!errors.phone} helperText={errors.phone?.message?.toString()} required />
                        <TextField label="Address" {...register("address")} fullWidth />
                        <StyledButton type="submit" variant="contained" color="secondary" fullWidth disabled={!isValid || saving}>
                            {saving ? (
                                <>
                                    <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </StyledButton>
                    </form>
                ) : (
                    <ProfileContainer elevation={3}>
                        <InfoText as="div">
                            <Label as="span">👤 Full Name:</Label>
                            <Value as="span">{user.fullName}</Value>
                        </InfoText>
                        <InfoText as="div">
                            <Label as="span">✉️ Email:</Label>
                            <Value as="span">{user.email}</Value>
                        </InfoText>
                        <InfoText as="div">
                            <Label as="span">📞 Phone:</Label>
                            <Value as="span">{user.phone}</Value>
                        </InfoText>
                        {user.address && (
                            <InfoText as="div">
                                <Label as="span">🏠 Address:</Label>
                                <Value as="span">{user.address}</Value>
                            </InfoText>
                        )}
                        <StyledButton variant="contained" color="secondary" onClick={() => setIsEditing(true)}>Edit profile</StyledButton>
                    </ProfileContainer>
                )}
            </ContentBox>
            <AutoSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </Box>
    );
}
