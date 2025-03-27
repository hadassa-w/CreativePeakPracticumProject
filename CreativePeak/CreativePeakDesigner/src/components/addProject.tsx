import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
    Button, TextField, Box, Typography, Container, CircularProgress,
    MenuItem, Select, InputLabel, FormControl, FormHelperText
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

const FileInputLabel = styled("label")({
    display: "block",
    backgroundColor: "#fea3c1",
    color: "white",
    textAlign: "center",
    padding: "10px 15px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s",
    "&:hover": {
        backgroundColor: "#ff86af",
    },
});

const HiddenFileInput = styled("input")({
    display: "none",
});

interface FormData {
    fileName: string;
    description: string;
    linkURL: string;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    image: FileList;
}

interface Category {
    id: number;
    name: string;
}

export default function AddImageForm() {
    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<FormData>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string>("No file chosen");
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios.get("https://creativepeak-api.onrender.com/api/Category")
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("fileName", data.fileName);
        formData.append("description", data.description);
        formData.append("linkURL", data.linkURL);
        formData.append("createdAt", data.createdAt);
        formData.append("updatedAt", data.updatedAt);
        formData.append("categoryId", data.categoryId.toString());
        formData.append("image", data.image[0]);

        try {
            await axios.post("https://creativepeak-api.onrender.com/api/Image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("🎉 Image added successfully!");
            reset();
            setImagePreview(null);
            setFileName("No file chosen");
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
                    🖼️ Add New Image
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* File Name */}
                    <TextField
                        label="File Name"
                        {...register("fileName", { required: "File Name is required" })}
                        fullWidth
                        error={!!errors.fileName}
                        helperText={errors.fileName?.message?.toString()}
                    />

                    {/* Description */}
                    <TextField
                        label="Description"
                        {...register("description", { required: "Description is required" })}
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description?.message?.toString()}
                    />

                    {/* Category Select */}
                    <FormControl fullWidth error={!!errors.categoryId}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={watch("categoryId") || ""}
                            onChange={(e) => setValue("categoryId", Number(e.target.value))}
                        >
                            <MenuItem value="" disabled>Select a category</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.categoryId?.message?.toString()}</FormHelperText>
                    </FormControl>

                    {/* Image Upload */}
                    <FileInputLabel>
                        Upload Image
                        <HiddenFileInput
                            type="file"
                            accept="image/*"
                            {...register("image", { required: "Image is required" })}
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    setFileName(files[0].name);
                                    setImagePreview(URL.createObjectURL(files[0]));
                                    setValue("image", files); // עדכון ב- react-hook-form
                                }
                            }}
                        />
                    </FileInputLabel>
                    <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                        {fileName}
                    </Typography>
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100%", marginTop: "10px", borderRadius: "8px" }} />}
                    {errors.image && <Typography color="error">{errors.image.message?.toString()}</Typography>}

                    {/* Submit Button */}
                    <StyledButton type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
                    </StyledButton>
                </form>
            </ContentBox>
        </Box>
    );
}
