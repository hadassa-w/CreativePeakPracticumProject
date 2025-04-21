import { useState, useEffect } from "react";
import { Button, Box, Typography, Container, IconButton, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/system";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Category from "../models/category";
import Image from "../models/image";
import { useAuth } from "../contexts/authContext";
import AutoSnackbar from "./snackbar";

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

// כפתור הוספה מעוצב
const AddCategoryButton = styled(Button)({
    textTransform: "none",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "10px",
    padding: "10px 20px",
    transition: "0.3s",
    backgroundColor: "#9C27B0", // צבע סגלגל
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    "&:hover": {
        transform: "scale(1.05)",
        backgroundColor: "#7B1FA2", // צבע כהה יותר בעת ריחוף
    },
});

const CategoriesList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

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
        const confirmed = window.confirm(
            "Are you sure you want to delete this category (When you delete a category, all projects in it are also deleted)?"
        );

        if (!confirmed) return;

        setDeleting(categoryId);

        try {
            await axios.delete(`https://creativepeak-api.onrender.com/api/Category/${categoryId}`);

            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryId)
            );

            setSnackbarMessage("🎉 Category deleted successfully");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            const response = await axios.get("https://creativepeak-api.onrender.com/api/Image");
            const userImages = response.data.filter((image: Image) => image.user.id === userId);

            await Promise.all(
                userImages.map((image: Image) =>
                    axios.delete(`https://creativepeak-api.onrender.com/api/Image/${image.id}`)
                )
            );

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

                {/* כפתור הוספה המעודכן */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <AddCategoryButton variant="contained" onClick={() => navigate("/addCategory")}>
                        <Add /> Add category
                    </AddCategoryButton>
                </Box>

                <br /><br />
                {loading ? (
                    <CircularProgress sx={{ color: "grey" }} />
                ) : categories.length === 0 ? (
                    <Typography sx={{ color: "gray" }}>
                        No categories found.
                    </Typography>
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
                                        {deleting === category.id ? <CircularProgress size={20} sx={{ color: "grey" }} /> : <Delete />}
                                    </IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </CategoryList>
                )}
            </ContentBox>
            <AutoSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </Box>
    );
};

export default CategoriesList;
