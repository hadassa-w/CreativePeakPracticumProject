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
import { useLocation, useNavigate } from "react-router-dom";
import FileUploader from "../AWS/s3Image";
import Category from "../models/category";
import Project from "../models/project";
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

const AddImageForm = () => {
  const { register, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm<Project>();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userImages, setUserImages] = useState<Project[]>([]);
  const { userId } = useAuth();
  const location = useLocation();
  const image = location.state?.image || null;
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, imgRes] = await Promise.all([
          axios.get(`https://creativepeak-api.onrender.com/api/Category?userId=${userId}`),
          axios.get(`https://creativepeak-api.onrender.com/api/Image?userId=${userId}`)
        ]);
        setCategories(catRes.data);
        setUserImages(imgRes.data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  useEffect(() => {
    if (image) {
      setValue("fileName", image.fileName);
      setValue("description", image.description);
      setValue("categoryId", image.category.id);
      localStorage.setItem("linkURL", image.linkURL);
    }
  }, [image, setValue]);

  const onSubmit = async (data: Project) => {
    setLoading(true);

    const isDuplicate = userImages.some((img) =>
      img.fileName.trim().toLowerCase() === data.fileName.trim().toLowerCase() &&
      (!image || img.id !== image.id) // מתעלם מהתמונה הנוכחית בעת עריכה
    );

    if (!image && isDuplicate) {
      alert("⚠️ A project with this name already exists!");
      setLoading(false);
      return;
    }

    const dataToSubmit = {
      ...data,
      linkURL: localStorage.getItem("linkURL"),
      userId
    };

      localStorage.removeItem("linkURL");

    try {
      if (image) {
        await axios.put(`https://creativepeak-api.onrender.com/api/Image/${image.id}`, dataToSubmit);
        setSnackbarMsg("🎉 Project updated successfully!");
      } else {
        await axios.post("https://creativepeak-api.onrender.com/api/Image", dataToSubmit);
        setSnackbarMsg("🎉 Project added successfully!");
      }

      setSnackbarOpen(true);
      setTimeout(() => navigate("/projects"), 1000);
      reset();
    } catch (err) {
      console.error("❌ Error saving project", err);
      alert("Error saving project. Please try again.");
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
            helperText={errors.fileName?.message}
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

          <FormControl fullWidth error={!!errors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select
              {...register("categoryId", { required: "Category is required" })}
              value={watch("categoryId") || ""}
              onChange={(e) => setValue("categoryId", Number(e.target.value))}
            >
              <MenuItem value="" disabled>Select a category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.categoryId?.message}</FormHelperText>
          </FormControl>

          <FileUploader existingImageUrl={image?.linkURL} />

          <StyledButton type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Saving...
              </>
            ) : image ? (
              "Save Changes"
            ) : (
              "Upload Project"
            )}
          </StyledButton>
        </form>
      </ContentBox>

      <AutoSnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default AddImageForm;
