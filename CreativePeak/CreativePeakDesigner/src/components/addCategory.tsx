import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Container, CircularProgress } from "@mui/material";
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
  "&:hover": { transform: "scale(1.05)" },
});

interface CategoryFormData {
  categoryName: string;
  description: string;
  userId: number;
}

const AddCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryToEdit = location.state?.category || null;
  const userId = parseInt(localStorage.getItem("userId") || "0", 10);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormData>();
  const [loading, setLoading] = useState(false);

  // כאשר נכנסים לדף עם קטגוריה לעריכה, נטען את הערכים לטופס
  useEffect(() => {
    if (categoryToEdit) {
      reset({
        categoryName: categoryToEdit.categoryName,
        description: categoryToEdit.description,
      });
    }
  }, [categoryToEdit, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    const dataToSubmit = { ...data, userId };

    try {
      if (categoryToEdit) {
        // עדכון קטגוריה קיימת
        await axios.put(`https://creativepeak-api.onrender.com/api/Category/${categoryToEdit.id}`, dataToSubmit);
        alert("✅ Category updated successfully!");
      } else {
        // הוספת קטגוריה חדשה
        await axios.post("https://creativepeak-api.onrender.com/api/Category", dataToSubmit);
        alert("🎉 Category added successfully!");
      }

      // חזרה אוטומטית לעמוד AllCategories
      navigate("/allCategories");
    } catch (error) {
      console.error("❌ Error saving category", error);
      alert("Error saving category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
      <ContentBox>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
          {categoryToEdit ? "✏️ Edit Category" : "🏷️ Add Category"}
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
            {loading ? <><CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Saving...</> : categoryToEdit ? "Save Changes" : "Add Category"}
          </StyledButton>
        </form>
      </ContentBox>
    </Box>
  );
};

export default AddCategoryForm;
