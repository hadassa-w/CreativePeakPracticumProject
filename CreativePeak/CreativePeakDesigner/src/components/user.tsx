import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
    Button, TextField, Box, Typography, Container, CircularProgress,
    Paper
} from "@mui/material";
import { styled } from "@mui/system";

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

interface UserData {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

export default function EditUserForm() {
    const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<UserData>({
        mode: "onChange",
    });

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const userId = parseInt(localStorage.getItem("userId") || "0", 10);
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`https://creativepeak-api.onrender.com/api/User/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const data = response.data;
                setUserData(data);
                Object.keys(data).forEach(key => setValue(key as keyof UserData, data[key as keyof UserData]));
            })
            .catch(error => console.error("Error fetching user data", error))
            .finally(() => setLoading(false));
    }, [userId, setValue]);

    const onSubmit = async (data: UserData) => {
        setLoading(true);
        const token = localStorage.getItem("token");
    
        if (!token) {
            alert("⚠️ Authentication token is missing!");
            setLoading(false);
            return;
        }
    
        try {
            await axios.put(
                `https://creativepeak-api.onrender.com/api/User/updateWithoutPassword/${userId}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserData(data); // ✅ עדכון הסטייט המקומי כדי להציג את הנתונים החדשים
            alert("🎉 Details updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("❌ Error updating data:", error);
            alert("❌ Failed to update details.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>✏️ Profile</Typography>
                {loading ? (
                    <CircularProgress />
                ) : isEditing || !userData ? (
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <TextField label="Full Name" {...register("fullName", { required: "Full Name is required" })} fullWidth error={!!errors.fullName} helperText={errors.fullName?.message?.toString()} required />
                        <TextField label="Email" type="email" {...register("email", { required: "Email is required" })} fullWidth error={!!errors.email} helperText={errors.email?.message?.toString()} required />
                        <TextField label="Phone" type="tel" {...register("phone", { required: "Phone is required" })} fullWidth error={!!errors.phone} helperText={errors.phone?.message?.toString()} required />
                        <TextField label="Address" {...register("address")} fullWidth />
                        <StyledButton type="submit" variant="contained" color="secondary" fullWidth disabled={!isValid || loading}>
                            {loading ? (
                                <>
                                    <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Saveing...
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
                            <Value as="span">{userData.fullName}</Value>
                        </InfoText>
                        <InfoText as="div">
                            <Label as="span">✉️ Email:</Label>
                            <Value as="span">{userData.email}</Value>
                        </InfoText>
                        <InfoText as="div">
                            <Label as="span">📞 Phone:</Label>
                            <Value as="span">{userData.phone}</Value>
                        </InfoText>
                        {userData.address && (
                            <InfoText as="div">
                                <Label as="span">🏠 Address:</Label>
                                <Value as="span">{userData.address}</Value>
                            </InfoText>
                        )}
                        <StyledButton variant="contained" color="secondary" onClick={() => setIsEditing(true)}>Edit profile</StyledButton>
                    </ProfileContainer>
                )}
            </ContentBox>
        </Box>
    );
}
