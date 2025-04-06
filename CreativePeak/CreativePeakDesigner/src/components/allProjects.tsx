import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, Button } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Image from "../models/image";
import Category from "../models/category";

const ContentBox = styled(Box)({
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "900px",
    textAlign: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    margin: "auto",
});

function ImageGallery() {
    const [images, setImages] = useState<Image[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = parseInt(localStorage.getItem("userId") || "0", 10) || null;
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        Promise.all([
            axios.get(`https://creativepeak-api.onrender.com/api/Image`),
            axios.get(`https://creativepeak-api.onrender.com/api/Category`)
        ])
            .then(([imagesResponse, categoriesResponse]) => {
                const filteredImages = imagesResponse.data.filter((image: Image) => image.user.id === userId);
                const filteredCategories = categoriesResponse.data.filter((category: Category) => category.userId == userId);

                setImages(filteredImages);
                setCategories(filteredCategories);
            })
            .catch(error => {
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
            axios.delete(`https://creativepeak-api.onrender.com/api/Image/${imageId}`)
                .then(() => {
                    setImages(prevImages => prevImages.filter((image) => image.id !== imageId));
                    alert("Project deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting project:", error);
                    alert("Error deleting project. Please try again later.");
                });
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                    🖼️ Project Gallery
                </Typography>
                <Link to="/addProject" style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="secondary" sx={{ marginTop: 3, textTransform: "none", fontSize: "16px", fontWeight: "bold", borderRadius: "10px", padding: "10px 20px", transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}>
                        <Add /> Add project
                    </Button>
                </Link>
                <br /><br />
                {loading ? (
                    <CircularProgress />
                ) : (
                    images.length === 0 ? (
                        <Typography sx={{ color: "gray" }}>
                            No projects available. <br />Add a new project to get started!
                        </Typography>
                    ) : (
                        categories.map((category) => {
                            const categoryImages = images.filter((img) => img.category.id == category.id);
                            if (categoryImages.length === 0) return null;
                            return (
                                <Box key={category.id} sx={{ mb: 4 }}>
                                    <Typography variant="h2" sx={{ fontWeight: "bold", color: "#333", mb: 2, fontSize: "30px" }}>
                                        {category.categoryName}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: "#333", mb: 2, fontSize: "25px" }}>
                                        {category.description}
                                    </Typography>
                                    {categoryImages.map((image) => (
                                        <Card key={image.id} sx={{ maxWidth: 300, margin: "auto" }}>
                                            <CardMedia component="img" height="200" image={image.linkURL} alt={image.fileName} />
                                            <CardContent>
                                                <Typography variant="body1" sx={{ fontWeight: "bold" }}>{image.fileName}</Typography>
                                                <Typography variant="body2" color="text.secondary">{image.description}</Typography>
                                                <Typography variant="body2" sx={{ color: "gray", fontFamily: "monospace", mb: 2, fontSize: "12px" }}>
                                                    Create at: {new Date(image.createdAt).toLocaleDateString()}
                                                    <br />
                                                    Update at: {new Date(image.updatedAt).toLocaleDateString()}
                                                </Typography>
                                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Button variant="outlined" color="primary" size="small" sx={{ borderRadius: "10px" }} onClick={() => handleEdit(image)}>
                                                        <Edit /> Edit
                                                    </Button>
                                                    <Button variant="outlined" color="error" size="small" sx={{ borderRadius: "10px" }} onClick={() => handleDelete(image.id)}>
                                                        <Delete /> Delete
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            );
                        })
                    )
                )}
            </ContentBox>
        </Box>
    );
}

export default ImageGallery;