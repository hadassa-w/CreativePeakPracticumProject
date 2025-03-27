import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
    Button, TextField, Box, Typography, Container, CircularProgress
} from "@mui/material";
import { styled } from "@mui/system";

// עיצוב הקומפוננטה
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

// ממשק לפרטי המעצב
interface DesignerDetails {
    fullName: string;
    addressSite: string;
    email: string;
    phone: string;
    yearsExperience: number;
    priceRangeMin: number;
    priceRangeMax: number;
    user: number;
}

export default function DesignerDetailsForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<DesignerDetails>();
    const [loading, setLoading] = useState(false);

    // שליפת נתוני המשתמש מה-localStorage
    const user = localStorage.getItem("userId") || "";

    const onSubmit = async (data: DesignerDetails) => {
        setLoading(true);

        // בדיקה אם המשתמש מחובר
        if (!user) {
            alert("❌ User is not logged in. Please log in first.");
            setLoading(false);
            return;
        }

        // הוספת מזהה המשתמש לאובייקט שנשלח לשרת
        const designerData = {
            ...data,
            userId: user
        };

        try {
            await axios.post("https://creativepeak-api.onrender.com/api/DesignerDetails", designerData);
            alert("🎉 Designer details submitted successfully!");
            reset();
        } catch (error) {
            console.error("❌ Submission failed", error);
            alert("Error submitting designer details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                    ✏️ Designer Details
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <TextField
                        label="Full Name"
                        {...register("fullName", { required: "Full Name is required" })}
                        fullWidth
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message?.toString()}
                    />

                    <TextField
                        label="Website Address"
                        {...register("addressSite")}
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email format"
                            }
                        })}
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message?.toString()}
                    />

                    <TextField
                        label="Phone"
                        type="tel"
                        {...register("phone", { required: "Phone is required" })}
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone?.message?.toString()}
                    />

                    <TextField
                        label="Years of Experience"
                        type="number"
                        {...register("yearsExperience", { required: "Years of experience is required", min: 0 })}
                        fullWidth
                        error={!!errors.yearsExperience}
                        helperText={errors.yearsExperience?.message?.toString()}
                    />

                    <TextField
                        label="Minimum Price"
                        type="number"
                        {...register("priceRangeMin", { required: "Minimum price is required", min: 0 })}
                        fullWidth
                        error={!!errors.priceRangeMin}
                        helperText={errors.priceRangeMin?.message?.toString()}
                    />

                    <TextField
                        label="Maximum Price"
                        type="number"
                        {...register("priceRangeMax", { required: "Maximum price is required", min: 0 })}
                        fullWidth
                        error={!!errors.priceRangeMax}
                        helperText={errors.priceRangeMax?.message?.toString()}
                    />

                    <StyledButton type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
                        {loading ? (
                            <>
                                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Submitting...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </StyledButton>
                </form>
            </ContentBox>
        </Box>
    );
}
