import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, TextField, Box, Typography, Container, CircularProgress, MenuItem, Select, InputLabel, FormControl, FormHelperText } from "@mui/material";
import { styled } from "@mui/system";
import FileUploader from "../AWS/s3Image"; // מייבאים את FileUploader

const ContentBox = styled(Container)({
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
});

interface FormData {
  fileName: string;
  description: string;
  linkURL: string;
  designerId: number;
  categoryId: number;
}

interface Category {
  id: number;
  categoryName: string;
  DesignerDetailsId: number;
}

export default function AddImageForm() {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormData>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios.get("https://creativepeak-api.onrender.com/api/Category")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    const handleConsoleMessage = (event: MessageEvent) => {
      if (typeof event.data === "string" && event.data.includes("https://")) {
        setImageUrl(event.data.trim());
      }
    };

    window.addEventListener("message", handleConsoleMessage);

    return () => {
      window.removeEventListener("message", handleConsoleMessage);
    };
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!imageUrl) {
      alert("❌ אנא העלה תמונה לפני שליחת הטופס!");
      return;
    }

    setLoading(true);

    const formData = {
      fileName: data.fileName,
      description: data.description,
      linkURL: imageUrl,
      categoryId: data.categoryId,
    };

    try {
      await axios.post("https://creativepeak-api.onrender.com/api/Image", formData);
      alert("🎉 התמונה נוספה בהצלחה!");
      reset();
      setImageUrl(null);
    } catch (error) {
      console.error("❌ שגיאה בשליחת הנתונים:", error);
      alert("Error uploading image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
      <ContentBox>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
          🖼️ העלאת תמונה
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField label="שם קובץ" {...register("fileName", { required: "חובה להזין שם קובץ" })} fullWidth error={!!errors.fileName} helperText={errors.fileName?.message} />
          <TextField label="תיאור" {...register("description", { required: "חובה להזין תיאור" })} fullWidth multiline rows={3} error={!!errors.description} helperText={errors.description?.message} />

          <FormControl fullWidth error={!!errors.categoryId}>
            <InputLabel>קטגוריה</InputLabel>
            <Select {...register("categoryId", { required: "חובה לבחור קטגוריה" })} onChange={(e) => setValue("categoryId", Number(e.target.value))} defaultValue="">
              <MenuItem value="" disabled>בחר קטגוריה</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>{category.categoryName}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.categoryId?.message}</FormHelperText>
          </FormControl>

          <FileUploader />

          {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: "100%", maxHeight: "200px", marginTop: "10px", borderRadius: "8px" }} />}

          <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
            {loading ? <><CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> טוען...</> : "העלה"}
          </Button>
        </form>
      </ContentBox>
    </Box>
  );
}
