import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/system";
import Category from "../models/category";
import { useAuth } from "../contexts/authContext";
import AutoSnackbar from "./snackbar";

const ContentBox = styled(Container)({
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: "12px",
  padding: "40px",
  maxWidth: "500px",
  textAlign: "center",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)"
});

const StyledButton = styled(Button)({
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "10px",
  padding: "10px 20px",
  transition: "0.3s",
  "&:hover": { transform: "scale(1.05)" }
});

const AddCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryToEdit = location.state?.category || null;

  const { userId } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Category>();

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [userCategories, setUserCategories] = useState<Category[]>([]);

  // טעינת קטגוריות של המשתמש
  useEffect(() => {
    const fetchUserCategories = async () => {
      try {
        const response = await axios.get(
          `https://creativepeak-api.onrender.com/api/Category?userId=${userId}`
        );
        setUserCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    if (userId) {
      fetchUserCategories();
    }
  }, [userId]);

  // אם זה עריכה - מילוי הטופס בנתונים הקיימים
  useEffect(() => {
    if (categoryToEdit) {
      reset({
        categoryName: categoryToEdit.categoryName,
        description: categoryToEdit.description
      });
    }
  }, [categoryToEdit, reset]);

  const onSubmit = async (data: Category) => {
    setLoading(true);
    const dataToSubmit = { ...data, userId };

    // בדיקה אם הקטגוריה כבר קיימת אצל המשתמש
    const nameExists = userCategories.some(cat =>
      cat.categoryName.trim().toLowerCase() === data.categoryName.trim().toLowerCase()
    );

    if (!categoryToEdit && nameExists) {
      alert("⚠️ Category name already exists!");
      setLoading(false);
      return;
    }

    try {
      if (categoryToEdit) {
        await axios.put(
          `https://creativepeak-api.onrender.com/api/Category/${categoryToEdit.id}`,
          dataToSubmit
        );
        setSnackbarMsg("🎉 Category updated successfully!"); // עדכון הצליח
      } else {
        await axios.post(
          "https://creativepeak-api.onrender.com/api/Category",
          dataToSubmit
        );
        setSnackbarMsg("🎉 Category added successfully!"); // יצירה הצליחה
      }

      setSnackbarOpen(true);
      setTimeout(() => navigate("/categories"), 1000);
    } catch (error) {
      console.error("❌ Error saving category", error);
      alert("Error saving category. Please try again."); // שגיאה
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
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Saving...
              </>
            ) : categoryToEdit ? (
              "Save Changes"
            ) : (
              "Add Category"
            )}
          </StyledButton>
        </form>
      </ContentBox>

      {/* AutoSnackbar להצלחות */}
      <AutoSnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default AddCategoryForm;
