import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, TextField, Box, Typography, Container, CircularProgress, MenuItem, Select, InputLabel, FormControl, FormHelperText } from "@mui/material";
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
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string>("No file chosen");
    const [categories, setCategories] = useState<Category[]>([]);


    useEffect(() => {
        // Fetch categories from the server
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
        formData.append("categoryId", data.categoryId.toString());
        // formData.append("designerId",user.de );

        try {
            await axios.post("https://creativepeak-api.onrender.com/api/Image", formData);
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
                            {...register("categoryId", { required: "Category is required" })}
                            onChange={(e) => setValue("categoryId", Number(e.target.value))}
                            defaultValue=""
                        >
                            <MenuItem value="" disabled>Select a category</MenuItem>

                            {categories.map((category) => (
                                // category.DesignerDetailsId === localStorage.getItem("userId") ?
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </MenuItem>
                                    // : null
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
                            {...register("linkURL", { required: "Image is required" })}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFileName(file.name);
                                    setImagePreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </FileInputLabel>
                    <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                        {fileName}
                    </Typography>
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100%",maxHeight:"200px", marginTop: "10px", borderRadius: "8px" }} />}
                    {errors.linkURL && <Typography color="error">{errors.linkURL.message?.toString()}</Typography>}

                    {/* Submit Button */}
                    <StyledButton type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
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
}

