import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, Dialog, IconButton, Button, TextField, MenuItem, } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import Image from "../models/image";
import Category from "../models/category";
import AutoSnackbar from "./snackbar";

// עיצוב

// כפתור כללי בסיסי
const StyledButton = styled(Button)({
    textTransform: "none",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "10px",
    padding: "8px 16px",
    transition: "0.3s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    "&:hover": {
        transform: "scale(1.05)",
    },
});

// כפתור הוספה
const AddButton = styled(StyledButton)({
    backgroundColor: "#9C27B0",
    color: "white",
    "&:hover": {
        backgroundColor: "#7B1FA2",
    },
});

// כפתור עריכה
const EditButton = styled(StyledButton)({
    borderColor: "#AB47BC",
    margin: "0 10px",
    color: "#AB47BC",
    "&:hover": {
        backgroundColor: "#F3E5F5",
        borderColor: "#9C27B0",
        color: "#9C27B0",
    },
});

// כפתור מחיקה
const DeleteButton = styled(StyledButton)({
    borderColor: "#F06292",
    margin: "0 10px",
    color: "#F06292",
    "&:hover": {
        backgroundColor: "#FCE4EC",
        borderColor: "#EC407A",
        color: "#EC407A",
    },
});

const ContentBox = styled(Box)({
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "20px",
    maxWidth: "1500px",
    textAlign: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    margin: "auto",
});

const CategoryTitle = styled(Typography)({
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: "15px",
    fontSize: "36px",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.40)",
});

const CategoryDescription = styled(Typography)({
    marginBottom: "20px",
    fontSize: "22px",
    fontStyle: "italic",
});

function ImageGallery() {
    const [images, setImages] = useState<Image[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const userId = parseInt(localStorage.getItem("userId") || "0", 10) || null;
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        Promise.all([
            axios.get(`https://creativepeak-api.onrender.com/api/Image`),
            axios.get(`https://creativepeak-api.onrender.com/api/Category`),
        ])
            .then(([imagesResponse, categoriesResponse]) => {
                const filteredImages = imagesResponse.data.filter(
                    (image: Image) => image.user.id === userId
                );
                const filteredCategories = categoriesResponse.data.filter(
                    (category: Category) => category.userId == userId
                );

                setImages(filteredImages);
                setCategories(filteredCategories);
            })
            .catch((error) => {
                console.error("Error while retrieving data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId]);

    const handleEdit = (image: Image) => {
        navigate("/addProject", { state: { image } });
    };

    const handleDelete = (imageId: number) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            axios
                .delete(`https://creativepeak-api.onrender.com/api/Image/${imageId}`)
                .then(() => {
                    setImages((prevImages) =>
                        prevImages.filter((image) => image.id !== imageId)
                    );
                    setSnackbarMessage("🎉 Project deleted successfully!");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                })
                .catch((error) => {
                    console.error("Error deleting project:", error);
                    setSnackbarMessage("❌ Error deleting project. Please try again later.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                });
        }
    };

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
    };

    const handleCloseDialog = () => {
        setSelectedImage(null);
    };

    const filteredImages = images.filter((image) => {
        const matchesSearch = image.fileName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategoryId === null || image.category.id === selectedCategoryId;
        return matchesSearch && matchesCategory;
    });

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
                <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}
                >
                    🖼️ Projects Gallery
                </Typography>

                {/* כפתור הוספה במרכז */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Link to="/addProject" style={{ textDecoration: "none" }}>
                        <AddButton variant="contained" sx={{ marginTop: 3, margin: "20px" }}>
                            <Add /> Add project
                        </AddButton>
                    </Link>
                </Box>

                {/* שורת חיפוש וסינון - תוצג רק אם יש תמונות */}
                {filteredImages.length > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
                        <ContentBox>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}
                            >
                                <SearchIcon sx={{ marginRight: "10px" }} />
                                Filter projects
                            </Typography>
                            <TextField
                                label="Search by name"
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ margin: "10px" }}
                            />
                            <TextField
                                select
                                label="Filter by category"
                                variant="outlined"
                                size="small"
                                value={selectedCategoryId ?? ""}
                                onChange={(e) =>
                                    setSelectedCategoryId(
                                        e.target.value === "" ? null : Number(e.target.value)
                                    )
                                }
                                sx={{ minWidth: 200, margin: "10px" }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.categoryName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </ContentBox>
                    </Box>
                )}

                {
                    loading ? (
                        <CircularProgress sx={{ color: "grey" }} />
                    ) : filteredImages.length === 0 ? (
                        <Typography sx={{ color: "gray" }}>
                            No projects available. <br />
                            Add a new project to get started!
                        </Typography>
                    ) : (
                        categories.map((category) => {
                            const categoryImages = filteredImages
                                .filter((img) => img.category.id === category.id)
                                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                            if (categoryImages.length === 0) return null;
                            return (
                                <Box key={category.id} sx={{ mb: 4 }}>
                                    <CategoryTitle>{category.categoryName}</CategoryTitle>
                                    <CategoryDescription>{category.description}</CategoryDescription>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            justifyContent: "center",
                                            gap: "20px",
                                        }}
                                    >
                                        {categoryImages.map((image) => (
                                            <Card
                                                key={image.id}
                                                sx={{
                                                    maxWidth: 320,
                                                    minWidth: 250,
                                                    margin: "auto",
                                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                                    padding: "10px",
                                                    transition: "transform 0.3s ease",
                                                    "&:hover": {
                                                        transform: "scale(1.05)",
                                                    },
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={image.linkURL}
                                                    alt={image.fileName}
                                                    onClick={() => handleImageClick(image.linkURL)}
                                                    sx={{ cursor: "pointer", borderRadius: "6px" }}
                                                />
                                                <CardContent>
                                                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                                        {image.fileName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {image.description}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "gray",
                                                            fontFamily: "monospace",
                                                            mb: 2,
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        Create at:{" "}
                                                        {new Date(image.createdAt).toLocaleDateString()}
                                                        <br />
                                                        Update at:{" "}
                                                        {new Date(image.updatedAt).toLocaleDateString()}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            mt: 1,
                                                        }}
                                                    >
                                                        <EditButton
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleEdit(image)}
                                                        >
                                                            <Edit fontSize="small" /> Edit
                                                        </EditButton>
                                                        <DeleteButton
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleDelete(image.id)}
                                                        >
                                                            <Delete fontSize="small" /> Delete
                                                        </DeleteButton>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            );
                        })
                    )
                }
            </ContentBox >
            <Dialog
                open={!!selectedImage}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                sx={{ '& .MuiDialog-paper': { position: 'relative', borderRadius: 3 } }}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        zIndex: 10,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img
                        src={selectedImage ?? ""}
                        alt="Enlarged"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "80vh",
                            objectFit: "contain",
                            borderRadius: "10px",
                        }}
                    />
                </Box>
            </Dialog>
            <AutoSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />

        </Box >
    );
}

export default ImageGallery;
