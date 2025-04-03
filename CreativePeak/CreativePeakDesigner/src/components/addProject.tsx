import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText
} from "@mui/material";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom"; // הוספת useLocation
import FileUploader from "../AWS/s3AddImage";

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
  "&:hover": {
    transform: "scale(1.05)"
  }
});

interface FormData {
  fileName: string;
  description: string;
  linkURL: string;
  userId: number;
  categoryId: number;
}

interface Category {
  id: number;
  categoryName: string;
  DesignerDetailsId: number;
  userId: number;
}

const AddImageForm = () => {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const userId = parseInt(localStorage.getItem("userId") || "0", 10) || null;
  const location = useLocation();
  const { image } = location.state || {}; // גישה למידע שהתמונה שנשלחה

  // Fetch categories inside useEffect
  useEffect(() => {
    axios.get(`https://creativepeak-api.onrender.com/api/Category`)
      .then(response => {
        setCategories(response.data.filter((category: Category) => category.userId == userId));
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });

    // אם מדובר בעריכת תמונה קיימת, נמלא את הנתונים בטופס
    if (image) {
      setValue("fileName", image.fileName);
      setValue("description", image.description);
      setValue("categoryId", image.category.id);
      localStorage.setItem("linkURL", image.linkURL); // שמירת URL בתמורה
    }
  }, [userId, image, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const dataToSubmit = {
        ...data,
        linkURL: localStorage.getItem("linkURL"),
        userId: userId,
      };

      if (image) {
        // אם מדובר בעדכון תמונה
        await axios.put(`https://creativepeak-api.onrender.com/api/Image/${image.id}`, dataToSubmit);
        alert("🎉 Project updated successfully!");
      } else {
        // אם מדובר בהוספת תמונה חדשה
        await axios.post("https://creativepeak-api.onrender.com/api/Image", dataToSubmit);
        alert("🎉 Project added successfully!");
      }

      reset(); // לאפס את הטופס לאחר ההגשה
    } catch (error) {
      console.error("❌ Upload failed", error);
      alert("Error uploading project. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
      <ContentBox>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
          {image ? "✏️ Edit Project" : "🖼️ Add Project"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="File Name"
            {...register("fileName", { required: "File Name is required" })}
            fullWidth
            error={!!errors.fileName}
            helperText={errors.fileName?.message?.toString()}
          />

          <TextField
            label="Description"
            {...register("description", { required: "Description is required" })}
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message?.toString()}
          />

          <FormControl fullWidth error={!!errors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select
              {...register("categoryId", { required: "Category is required" })}
              onChange={(e) => setValue("categoryId", Number(e.target.value))}
              defaultValue=""
            >
              <MenuItem value="" disabled>Select a category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.categoryId?.message?.toString()}</FormHelperText>
          </FormControl>

          <FileUploader />
          <StyledButton type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Uploading...
              </>
            ) : (
              "Upload project"
            )}
          </StyledButton>
        </form>
      </ContentBox>
    </Box>
  );
};

export default AddImageForm;
