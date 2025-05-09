import { useState, useEffect } from "react"
import {
    Button,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    List,
    ListItem,
    Paper,
    Divider,
    Fade,
    Chip,
    Card,
    CardContent,
    Avatar,
    Tooltip,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    InputAdornment,
    Collapse,
} from "@mui/material"
import { styled } from "@mui/system"
import {
    Edit,
    Delete,
    Add,
    Category as CategoryIcon,
    Search as SearchIcon,
    ArrowBack,
    Sort as SortIcon,
    FilterList as FilterIcon,
    ExpandMore,
    ExpandLess,
    Info as InfoIcon,
} from "@mui/icons-material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import type Category from "../models/category"
import type Image from "../models/image"
import AutoSnackbar from "./snackbar"
import { useAuth } from "../contexts/authContext"

const ContentBox = styled(Paper)(() => ({
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "800px",
    width: "100%",
    boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.15)",
    },
}))

const CategoryCard = styled(Card)(() => ({
    marginBottom: "16px",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    overflow: "hidden",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.12)",
    },
}))

const CategoryAvatar = styled(Avatar)(() => ({
    background: "linear-gradient(45deg, #9C27B0 30%, #AB47BC 90%)",
    color: "white",
    width: 50,
    height: 50,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
    marginRight: "16px",
}))

const StyledButton = styled(Button)(() => ({
    textTransform: "none",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "10px",
    padding: "10px 20px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
}))

const AddCategoryButton = styled(StyledButton)(() => ({
    background: "linear-gradient(45deg, #9C27B0 30%, #AB47BC 90%)",
    color: "white",
    "&:hover": {
        background: "linear-gradient(45deg, #7B1FA2 30%, #9C27B0 90%)",
    },
}))

const ActionButton = styled(IconButton)(() => ({
    transition: "all 0.2s ease",
    "&:hover": {
        transform: "scale(1.1)",
    },
}))

const EditButton = styled(ActionButton)(() => ({
    color: "#AB47BC",
    "&:hover": {
        backgroundColor: "rgba(171, 71, 188, 0.1)",
    },
}))

const DeleteButton = styled(ActionButton)(() => ({
    color: "#F06292",
    "&:hover": {
        backgroundColor: "rgba(240, 98, 146, 0.1)",
    },
}))

const EmptyStateContainer = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
}))

const SearchField = styled(TextField)(() => ({
    marginBottom: "20px",
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        transition: "all 0.3s ease",
        "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
        "&.Mui-focused": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
    },
}))

const CategoriesList = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const [categoryStats, setCategoryStats] = useState<Record<number, number>>({})
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")

    const navigate = useNavigate()
    const { userId } = useAuth()

    // Fetch categories and image counts
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch categories
                const categoriesResponse = await axios.get(`https://creativepeak-api.onrender.com/api/Category`)
                const userCategories = categoriesResponse.data.filter((category: Category) => category.userId == userId)
                setCategories(userCategories)
                setFilteredCategories(userCategories)

                // Fetch images to count per category
                const imagesResponse = await axios.get("https://creativepeak-api.onrender.com/api/Image")
                const userImages = imagesResponse.data.filter((image: Image) => image.user.id === userId)

                // Count images per category
                const stats: Record<number, number> = {}
                userImages.forEach((image: Image) => {
                    const categoryId = image.category.id
                    stats[categoryId] = (stats[categoryId] || 0) + 1
                })
                setCategoryStats(stats)
            } catch (error) {
                console.error("Error fetching data:", error)
                setSnackbarMessage("❌ Error loading categories. Please try again.")
                setSnackbarSeverity("error")
                setSnackbarOpen(true)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [userId])

    // Filter categories based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredCategories(categories)
        } else {
            const filtered = categories.filter(
                (category) =>
                    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredCategories(filtered)
        }
    }, [searchTerm, categories])

    const handleEdit = (category: Category) => {
        navigate("/addCategory", { state: { category } })
    }

    const confirmDelete = (category: Category) => {
        setCategoryToDelete(category)
        setDeleteDialogOpen(true)
    }

    const handleDelete = async () => {
        if (!categoryToDelete) return

        setDeleting(categoryToDelete.id)
        setDeleteDialogOpen(false)

        try {
            await axios.delete(`https://creativepeak-api.onrender.com/api/Category/${categoryToDelete.id}`)

            setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryToDelete.id))
            setFilteredCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryToDelete.id),
            )

            setSnackbarMessage("🎉 Category deleted successfully")
            setSnackbarSeverity("success")
            setSnackbarOpen(true)

            // Delete associated images
            const response = await axios.get("https://creativepeak-api.onrender.com/api/Image")
            const imagesToDelete = response.data.filter((image: Image) => image.category.id == categoryToDelete.id)

            await Promise.all(
                imagesToDelete.map((image: Image) =>
                    axios.delete(`https://creativepeak-api.onrender.com/api/Image/${image.id}`),
                ),
            )
        } catch (error) {
            console.error("Error deleting category:", error)
            setSnackbarMessage("❌ Error deleting category. Please try again.")
            setSnackbarSeverity("error")
            setSnackbarOpen(true)
        } finally {
            setDeleting(null)
            setCategoryToDelete(null)
        }
    }

    const toggleSort = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc"
        setSortOrder(newOrder)

        const sorted = [...filteredCategories].sort((a, b) => {
            if (newOrder === "asc") {
                return a.categoryName.localeCompare(b.categoryName)
            } else {
                return b.categoryName.localeCompare(a.categoryName)
            }
        })

        setFilteredCategories(sorted)
    }

    const toggleCategoryExpand = (categoryId: number) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
    }

    const getCategoryInitial = (name: string) => {
        return name.charAt(0).toUpperCase()
    }

    const renderEmptyState = () => (
        <EmptyStateContainer>
            <CategoryIcon sx={{ fontSize: 80, color: "#e0e0e0", mb: 2 }} />
            <Typography variant="h5" sx={{ color: "#9e9e9e", mb: 1 }}>
                No categories found
            </Typography>
            <Typography variant="body1" sx={{ color: "#9e9e9e", mb: 3, maxWidth: 400 }}>
                {categories.length === 0
                    ? "You haven't created any categories yet. Categories help you organize your projects."
                    : "No categories match your search criteria."}
            </Typography>
            {categories.length === 0 ? (
                <AddCategoryButton variant="contained" onClick={() => navigate("/addCategory")}>
                    <Add /> Create your first category
                </AddCategoryButton>
            ) : (
                <Button variant="outlined" color="primary" onClick={() => setSearchTerm("")} startIcon={<FilterIcon />}>
                    Clear search
                </Button>
            )}
        </EmptyStateContainer>
    )

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                minWidth: "600px",
            }}
        >
            <ContentBox elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            onClick={() => navigate("/")}
                            sx={{ mr: 2, bgcolor: "rgba(0,0,0,0.04)", "&:hover": { bgcolor: "rgba(0,0,0,0.08)" } }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: "bold",
                                background: "linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <CategoryIcon fontSize="large" sx={{ color: "#9C27B0" }} /> Categories
                        </Typography>
                    </Box>

                    <AddCategoryButton variant="contained" onClick={() => navigate("/addCategory")}>
                        <Add /> Add Category
                    </AddCategoryButton>
                </Box>

                {categories.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <SearchField
                                placeholder="Search categories..."
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Tooltip title={`Sort ${sortOrder === "asc" ? "Z-A" : "A-Z"}`}>
                                <IconButton onClick={toggleSort} sx={{ ml: 1 }}>
                                    <SortIcon
                                        sx={{
                                            transform: sortOrder === "desc" ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.3s ease",
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} found
                        </Typography>
                    </Box>
                )}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
                        <CircularProgress sx={{ color: "#9C27B0" }} />
                    </Box>
                ) : filteredCategories.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <List sx={{ p: 0 }}>
                        {filteredCategories.map((category) => (
                            <Fade key={category.id} in={true} timeout={500}>
                                <CategoryCard>
                                    <CardContent sx={{ p: 0 }}>
                                        <ListItem
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                p: 2,
                                            }}
                                        >
                                            <Badge
                                                badgeContent={categoryStats[category.id] || 0}
                                                color="primary"
                                                max={99}
                                                overlap="circular"
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        backgroundColor: "#9C27B0",
                                                        fontWeight: "bold",
                                                    },
                                                }}
                                            >
                                                <CategoryAvatar>{getCategoryInitial(category.categoryName)}</CategoryAvatar>
                                            </Badge>

                                            <Box sx={{ flexGrow: 1, mr: 2 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                        {category.categoryName}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        label={`${categoryStats[category.id] || 0} projects`}
                                                        sx={{ ml: 2, bgcolor: "rgba(156, 39, 176, 0.1)", fontSize: "0.7rem" }}
                                                    />
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: expandedCategory === category.id ? "unset" : 2,
                                                        WebkitBoxOrient: "vertical",
                                                    }}
                                                >
                                                    {category.description}
                                                </Typography>

                                                {category.description && category.description.length > 100 && (
                                                    <Button
                                                        size="small"
                                                        onClick={() => toggleCategoryExpand(category.id)}
                                                        endIcon={expandedCategory === category.id ? <ExpandLess /> : <ExpandMore />}
                                                        sx={{ textTransform: "none", p: 0, mt: 0.5, color: "#9C27B0" }}
                                                    >
                                                        {expandedCategory === category.id ? "Show less" : "Show more"}
                                                    </Button>
                                                )}
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Tooltip title="Edit category">
                                                    <EditButton onClick={() => handleEdit(category)}>
                                                        <Edit />
                                                    </EditButton>
                                                </Tooltip>
                                                <Tooltip title="Delete category">
                                                    <DeleteButton onClick={() => confirmDelete(category)} disabled={deleting === category.id}>
                                                        {deleting === category.id ? (
                                                            <CircularProgress size={20} sx={{ color: "grey" }} />
                                                        ) : (
                                                            <Delete />
                                                        )}
                                                    </DeleteButton>
                                                </Tooltip>
                                            </Box>
                                        </ListItem>

                                        <Collapse in={expandedCategory === category.id}>
                                            <Box sx={{ p: 2, pt: 0, bgcolor: "rgba(0,0,0,0.02)" }}>
                                                <Divider sx={{ mb: 2 }} />
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <InfoIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Created on {new Date(category.createdAt || Date.now()).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Collapse>
                                    </CardContent>
                                </CategoryCard>
                            </Fade>
                        ))}
                    </List>
                )}
            </ContentBox>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle sx={{ fontWeight: "bold", color: "#F06292" }}>Delete Category?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete <strong>{categoryToDelete?.categoryName}</strong>?
                        <br />
                        <br />
                        <Box sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", p: 2, borderRadius: 2 }}>
                            <Typography variant="body2" color="error" sx={{ fontWeight: "medium" }}>
                                Warning: This will also delete all projects ({categoryStats[categoryToDelete?.id || 0] || 0}) in this
                                category. This action cannot be undone.
                            </Typography>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{ borderRadius: "8px", textTransform: "none", borderColor: "purple", color: "purple", "&:hover": { borderColor: "gray", backgroundColor: "rgba(251, 225, 255, 0.36)" } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ borderRadius: "8px", textTransform: "none" }}
                    >
                        Delete Category
                    </Button>
                </DialogActions>
            </Dialog>

            <AutoSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </Box>
    )
}

export default CategoriesList
