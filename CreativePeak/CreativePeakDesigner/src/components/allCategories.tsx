import { useState, useEffect } from "react";
import { Button, Box, Typography, Container, IconButton, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/system";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ContentBox = styled(Container)({
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
});

const CategoryList = styled(List)({
    paddingTop: 0,
    paddingBottom: 0,
});

interface Category {
    id: number;
    categoryName: string;
    description: string;
    userId: number;
}

interface Image {
    id: number;
    fileName: string;
    description: string;
    linkURL: string;
    updatedAt: string;
    createdAt: string;
    category: Category;
    user: User;
}


interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: number;
}

const CategoriesList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const userId = parseInt(localStorage.getItem("userId") || "0", 10);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://creativepeak-api.onrender.com/api/Category")
            .then((response) => {
                const filteredCategories = response.data.filter((category: Category) => category.userId == userId);
                setCategories(filteredCategories);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleEdit = (category: Category) => {
        navigate("/addCategory", { state: { category } });
    };

    const handleDelete = async (categoryId: number) => {
        setDeleting(categoryId);
        try {
            await axios.delete(`https://creativepeak-api.onrender.com/api/Category/${categoryId}`);
            setCategories(categories.filter((category) => category.id !== categoryId));
            alert("Category deleted successfully");
            await axios.get("https://creativepeak-api.onrender.com/api/Image")
                .then((response) => {
                    const Images = response.data.filter((image: Image) => image.user.id == userId);
                    setImages(Images);
                    images.map((image: Image) => {
                        axios.delete(`https://creativepeak-api.onrender.com/api/Image/${image.id}`);
                    })
                })
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Error deleting category. Please try again.");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                    🏷️ Categories
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        marginTop: 3, textTransform: "none", fontSize: "16px", fontWeight: "bold", borderRadius: "10px", padding: "10px 20px", transition: "0.3s",
                        "&:hover": { transform: "scale(1.05)" },
                    }}
                    onClick={() => navigate("/addCategory")}
                >
                    <Add /> Add Category
                </Button>

                <br /><br />
                {loading ? (
                    <CircularProgress />
                ) : categories.length === 0 ? (
                    <Typography>No categories found.</Typography>
                ) : (
                    <CategoryList>
                        {categories.map((category) => (
                            <ListItem key={category.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <ListItemText primary={category.categoryName} secondary={category.description} />
                                <Box>
                                    <IconButton color="default" onClick={() => handleEdit(category)} sx={{ marginRight: "8px" }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="default" onClick={() => handleDelete(category.id)} disabled={deleting === category.id}>
                                        {deleting === category.id ? <CircularProgress size={20} sx={{ color: "white" }} /> : <Delete />}
                                    </IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </CategoryList>
                )}
            </ContentBox>
        </Box>
    );
};

export default CategoriesList;
