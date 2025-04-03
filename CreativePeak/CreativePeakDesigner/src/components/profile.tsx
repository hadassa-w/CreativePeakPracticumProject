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

interface DesignerDetails {
    id: number;
    fullName: string;
    addressSite: string;
    email: string;
    phone: string;
    yearsExperience: number;
    priceRangeMin: number;
    priceRangeMax: number;
    userId: number;
}

export default function DesignerDetailsForm() {
    const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<DesignerDetails>({
        mode: "onChange", // נוודא שהטופס יתעדכן בזמן אמת
    });
    const [loading, setLoading] = useState(true);
    const [designerDetails, setDesignerDetails] = useState<DesignerDetails | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const userId = parseInt(localStorage.getItem("userId") || "0", 10);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("https://creativepeak-api.onrender.com/api/DesignerDetails", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const filteredData = response.data.find((d: DesignerDetails) => d.userId === userId);
                if (filteredData) {
                    setDesignerDetails(filteredData);
                    Object.keys(filteredData).forEach(key => setValue(key as keyof DesignerDetails, filteredData[key as keyof DesignerDetails]));
                }
            })
            .catch(error => console.error("Error fetching designer details", error))
            .finally(() => setLoading(false));
    }, [userId, setValue]);

    const onSubmit = async (data: DesignerDetails) => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const designerData = { ...data, userId };

        if (!token) {
            alert("⚠️ Authentication token is missing!");
            setLoading(false);
            return;
        }

        try {
            let response;
            if (designerDetails) {
                response = await axios.put(
                    `https://creativepeak-api.onrender.com/api/DesignerDetails/${designerDetails.id}`,
                    designerData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                response = await axios.post(
                    "https://creativepeak-api.onrender.com/api/DesignerDetails",
                    designerData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            alert("🎉 Details saved successfully!");

            const updatedResponse = await axios.get(
                "https://creativepeak-api.onrender.com/api/DesignerDetails",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedData = updatedResponse.data.find((d: DesignerDetails) => d.userId === userId);
            setDesignerDetails(updatedData || null);
            setIsEditing(false);

        } catch (error) {
            console.error("❌ Error submitting data:", error);
            alert("❌ Failed to save details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>✏️ Designer Details</Typography>
                {loading ? (
                    <CircularProgress />
                ) : isEditing || !designerDetails ? (
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Typography variant="h6" sx={{ fontSize: "20px", mb: 3 }}>Please enter your business information.</Typography>
                        <TextField label="Full Name" {...register("fullName", { required: "Full Name is required" })} fullWidth error={!!errors.fullName} helperText={errors.fullName?.message?.toString()} required />
                        <TextField label="Website Address" {...register("addressSite")} fullWidth />
                        <TextField label="Email" type="email" {...register("email", { required: "Email is required" })} fullWidth error={!!errors.email} helperText={errors.email?.message?.toString()} required />
                        <TextField label="Phone" type="tel" {...register("phone", { required: "Phone is required" })} fullWidth error={!!errors.phone} helperText={errors.phone?.message?.toString()} required />
                        <TextField label="Years of Experience" type="number" {...register("yearsExperience", { required: "Years of experience is required", min: 0 })} fullWidth error={!!errors.yearsExperience} helperText={errors.yearsExperience?.message?.toString()} required />
                        <TextField label="Minimum Price (₪)" type="number" {...register("priceRangeMin", { required: "Minimum price is required", min: 0 })} fullWidth error={!!errors.priceRangeMin} helperText={errors.priceRangeMin?.message?.toString()} required />
                        <TextField label="Maximum Price (₪)" type="number" {...register("priceRangeMax", { required: "Maximum price is required", min: 0 })} fullWidth error={!!errors.priceRangeMax} helperText={errors.priceRangeMax?.message?.toString()} required />
                        <StyledButton type="submit" variant="contained" color="secondary" fullWidth disabled={!isValid || loading}>
                            {loading ? <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> : "Save"}
                        </StyledButton>
                    </form>
                ) : (
                    <ProfileContainer elevation={3}>
                        <InfoText as="div">
                            <Label as="span">👤 Full Name:</Label>
                            <Value as="span">{designerDetails.fullName}</Value>
                        </InfoText>
                        <InfoText as="div">
                            <Label as="span">✉️ Email:</Label>
                            <Value as="span">{designerDetails.email}</Value>
                        </InfoText>
                        {designerDetails.addressSite && (
                            <InfoText as="div">
                                <Label as="span">🌐 Website Address:</Label>
                                <Value as="span">{designerDetails.addressSite}</Value>
                            </InfoText>
                        )}
                        <InfoText as="div">
                            <Label as="span">📞 Phone:</Label>
                            <Value as="span">{designerDetails.phone}</Value>
                        </InfoText>
                        <InfoText as="div">
                            <Label as="span">🛠️ Experience:</Label>
                            <Value as="span">{designerDetails.yearsExperience} years</Value>
                        </InfoText>
                        <InfoText as="div">
                            <Label as="span">💰 Price Range:</Label>
                            <Value as="span">{designerDetails.priceRangeMin}₪ - {designerDetails.priceRangeMax}₪</Value>
                        </InfoText>
                        <StyledButton variant="contained" color="secondary" onClick={() => setIsEditing(true)}>Edit Profile</StyledButton>
                    </ProfileContainer>
                )}
            </ContentBox>
        </Box>
    );
}
