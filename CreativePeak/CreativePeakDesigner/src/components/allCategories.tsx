import { useState, useEffect } from "react";
import { Button, Box, Typography, Container, IconButton, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/system";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { Link } from "react-router-dom"; // עבור הקישור

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
    userId: number
}

const CategoriesList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const userId = parseInt(localStorage.getItem("userId") || "0", 10);

    // Fetch categories on load
    useEffect(() => {
        setLoading(true);
        axios.get("https://creativepeak-api.onrender.com/api/Category")
            .then((response) => {
                setCategories(response.data.filter((category: Category) => category.userId == userId));
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleEdit = (categoryId: number) => {
        // כאן תוכל להוסיף את הלוגיקה לעריכה
        alert(`Editing category with ID: ${categoryId}`);
    };

    const handleDelete = async (categoryId: number) => {
        setDeleting(categoryId);
        try {
            await axios.delete(`https://creativepeak-api.onrender.com/api/Category/${categoryId}`);
            setCategories(categories.filter((category) => category.id !== categoryId));
            alert("Category deleted successfully");
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Error deleting category. Please try again.");
        } finally {
            setDeleting(null);
        }
    };

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
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                    🏷️ Categories
                </Typography>

                {/* כפתור הוספת קטגוריה */}
                <Link to="/addCategory" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            marginTop: 3,
                            textTransform: "none",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "10px",
                            padding: "10px 20px",
                            transition: "0.3s",
                            "&:hover": {
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        🏷️ Add category
                    </Button>
                </Link>

                <br /><br />
                {loading ? (
                    <CircularProgress />
                ) : (
                    <CategoryList>
                        {categories.map((category) => (
                            <ListItem key={category.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <ListItemText
                                    primary={category.categoryName}
                                    secondary={category.description}
                                />
                                <Box>
                                    <IconButton color="default" onClick={() => handleEdit(category.id)} sx={{ marginRight: "8px" }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="default"
                                        onClick={() => handleDelete(category.id)}
                                        disabled={deleting === category.id}
                                    >
                                        {deleting === category.id ? (
                                            <CircularProgress size={20} sx={{ color: "white" }} />
                                        ) : (
                                            <Delete />
                                        )}
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
