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
import FileUploader from "../AWS/s3Image";

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
}

const AddImageForm = () => {
  const { register, handleSubmit, reset, formState: { errors }, setValue, getValues } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("No file chosen");
  const [categories, setCategories] = useState<Category[]>([]);
  const userId = parseInt(localStorage.getItem("userId") || "");

  useEffect(() => {
    axios.get(`https://creativepeak-api.onrender.com/api/Category?userId=${userId}`)
      .then(response => {
        setCategories(response.data);
        console.log(response.data);
      })

      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, [userId]);

  const handleImageUpload = async (file: any) => {
    try {
      const response = await axios.get('https://creativepeak-api.onrender.com/api/S3Images/image-url', {
        params: { fileName: file.name }
      });

      const presignedUrl = response.data.url;

      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      return presignedUrl;
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      throw new Error("Error uploading image.");
    }
  };

  const isFormValid = () => {
    const formValues = getValues();
    return (
      formValues.fileName?.trim() !== "" &&
      formValues.description?.trim() !== "" &&
      formValues.categoryId !== undefined
    );
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      if (data.linkURL) {
        const file = data.linkURL[0];
        const imageUrl = await handleImageUpload(file);

        const dataToSubmit = {
          ...data,
          linkURL: imageUrl,
          userId,
        };

        console.log(dataToSubmit);
        await axios.post("https://creativepeak-api.onrender.com/api/Image", dataToSubmit);
        alert("🎉 Image added successfully!");
        reset();
        setImagePreview(null);
        setFileName("No file chosen");
      }
    } catch (error) {
      console.error("❌ Upload failed", error);
      alert("Error uploading image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
      <ContentBox>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
          🖼️ Project
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

          <FileUploader onUploadComplete={(url) => setValue("linkURL", url)} />
          <StyledButton type="submit" variant="contained" color="secondary" fullWidth disabled={loading || !isFormValid()}>
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> Uploading...
              </>
            ) : (
              "Upload"
            )}
          </StyledButton>
        </form>
      </ContentBox>
    </Box>
  );
};

export default AddImageForm;