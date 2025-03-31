import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
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

interface CategoryFormData {
  categoryName: string;
  description: string;
  userId: number
}

const AddCategoryForm = () => {
  const userId = parseInt(localStorage.getItem("userId") || "0", 10) || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);

    const dataToSubmit = {
      ...data,
      userId: userId,
    };

    try {
      await axios.post("https://creativepeak-api.onrender.com/api/Category", dataToSubmit);
      alert("🎉 Category added successfully!");
      reset();
    } catch (error) {
      console.error("❌ Error adding category", error);
      alert("Error adding category. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <ContentBox>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
          🏷️ Add Category
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Category Name"
            {...register("categoryName", { required: "Category Name is required" })}
            fullWidth
            error={!!errors.categoryName}
            helperText={errors.categoryName?.message}
          />

          <TextField
            label="Description"
            {...register("description", { required: "Description is required" })}
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <StyledButton type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Adding...
              </>
            ) : (
              "Add Category"
            )}
          </StyledButton>
        </form>
      </ContentBox>
    </Box>
  );
};

export default AddCategoryForm;
