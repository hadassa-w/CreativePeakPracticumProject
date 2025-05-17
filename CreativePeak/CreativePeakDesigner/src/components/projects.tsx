import { useEffect, useState } from "react"
import axios from "axios"
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Chip,
  Fade,
  Skeleton,
  Divider,
  Paper,
  InputAdornment,
} from "@mui/material"
import { styled } from "@mui/system"
import { Link } from "react-router-dom"
import { Add, Edit, Delete, FilterAlt, Search, Image as ImageIcon, Category as CategoryIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import CloseIcon from "@mui/icons-material/Close"
import type Image from "../models/image"
import type Category from "../models/category"
import AutoSnackbar from "./snackbar"

// Styled Components
const StyledButton = styled(Button)({
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "10px",
  padding: "8px 16px",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
})

const AddButton = styled(StyledButton)({
  background: "linear-gradient(45deg, #9C27B0 30%, #AB47BC 90%)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #7B1FA2 30%, #9C27B0 90%)",
  },
})

const EditButton = styled(StyledButton)({
  borderColor: "#AB47BC",
  color: "#AB47BC",
  "&:hover": {
    backgroundColor: "rgba(171, 71, 188, 0.08)",
    borderColor: "#9C27B0",
    color: "#9C27B0",
  },
})

const DeleteButton = styled(StyledButton)({
  borderColor: "#F06292",
  color: "#F06292",
  "&:hover": {
    backgroundColor: "rgba(240, 98, 146, 0.08)",
    borderColor: "#EC407A",
    color: "#EC407A",
  },
})

const ContentBox = styled(Paper)(() => ({
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  borderRadius: "20px",
  padding: "30px",
  maxWidth: "2000px",
  boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
  },
  overflow: "hidden",
}))

const FilterBox = styled(Paper)(() => ({
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  borderRadius: "15px",
  padding: "20px",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
  marginBottom: "30px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "800px",
}))

const CategoryTitle = styled(Typography)({
  fontWeight: "800",
  background: "linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "15px",
  fontSize: "36px",
  letterSpacing: "1px",
  position: "relative",
  display: "inline-block",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-10px",
    left: "15px",
    width: "100px",
    height: "4px",
    background: "linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)",
    borderRadius: "2px",
  },
})

const CategoryDescription = styled(Typography)({
  marginBottom: "25px",
  fontSize: "18px",
  fontStyle: "italic",
  color: "#666",
})

const ProjectCard = styled(Card)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  margin: "10px",
  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
  borderRadius: "15px",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
  },
}))

const ImageContainer = styled(Box)({
  position: "relative",
  overflow: "hidden",
  height: "200px",
  cursor: "pointer",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover::after": {
    opacity: 1,
  },
})

const EmptyStateContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "50px 20px",
  textAlign: "center",
})

function ImageGallery() {
  const [images, setImages] = useState<Image[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageId1, setImageId1] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<Image | null>(null)

  const userId = Number.parseInt(localStorage.getItem("userId") || "0", 10) || null
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)

    Promise.all([
      axios.get(`https://creativepeak-api.onrender.com/api/Image`),
      axios.get(`https://creativepeak-api.onrender.com/api/Category`),
    ])
      .then(([imagesResponse, categoriesResponse]) => {
        const filteredImages = imagesResponse.data.filter((image: Image) => image.user.id === userId)
        const filteredCategories = categoriesResponse.data.filter((category: Category) => category.userId == userId)

        setImages(filteredImages)
        setCategories(filteredCategories)
      })
      .catch((error) => {
        console.error("Error while retrieving data:", error)
        setSnackbarMessage("❌ Error loading projects. Please try again later.")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId])

  const handleEdit = (image: Image) => {
    navigate("/addProject", { state: { image } })
  }

  const handleDeleteClick = (image: Image) => {
    setImageToDelete(image)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (!imageToDelete) return

    setImageId1(imageToDelete.id)
    setIsDeleting(true)
    setDeleteDialogOpen(false)

    axios
      .delete(`https://creativepeak-api.onrender.com/api/Image/${imageToDelete.id}`)
      .then(() => {
        setImages((prevImages) => prevImages.filter((image) => image.id !== imageToDelete.id))
        setSnackbarMessage("🎉 Project deleted successfully!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
      })
      .catch((error) => {
        console.error("Error deleting project:", error)
        setSnackbarMessage("❌ Error deleting project. Please try again later.")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      })
      .finally(() => {
        setIsDeleting(false)
        setImageId1(null)
        setImageToDelete(null)
      })
  }

  const handleImageClick = (image: Image) => {
    setSelectedImage(image)
  }

  const handleCloseDialog = () => {
    setSelectedImage(null)
  }

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategoryId === null || image.category.id === selectedCategoryId
    return matchesSearch && matchesCategory
  })

  const showSearchBox = images.length > 0
  const hasFilteredResults = filteredImages.length > 0

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategoryId(null)
  }

  const renderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <Box key={index} sx={{ width: { xs: "100%", sm: "calc(50% - 20px)", md: "calc(33.333% - 20px)" }, p: 1 }}>
          <Card sx={{ borderRadius: "15px", overflow: "hidden" }}>
            <Skeleton variant="rectangular" height={200} animation="wave" />
            <CardContent>
              <Skeleton variant="text" height={30} width="80%" animation="wave" />
              <Skeleton variant="text" height={20} animation="wave" />
              <Skeleton variant="text" height={20} width="60%" animation="wave" />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Skeleton variant="rectangular" height={36} width={80} animation="wave" />
                <Skeleton variant="rectangular" height={36} width={80} animation="wave" />
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))
  }

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <ImageIcon sx={{ fontSize: 80, color: "#e0e0e0" }} />
      <Typography variant="h5" sx={{ color: "#9e9e9e" }}>
        No projects found
      </Typography>
      <Typography variant="body1" sx={{ color: "#9e9e9e", mb: 3, maxWidth: 400 }}>
        {images.length === 0
          ? "You haven't added any projects yet. Start by creating your first project!"
          : "No projects match your current filters. Try adjusting your search criteria."}
      </Typography>
      {images.length === 0 ? (
        <Link to="/addProject" style={{ textDecoration: "none" }}>
          <AddButton variant="contained">
            <Add /> Create your first project
          </AddButton>
        </Link>
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearFilters}
          startIcon={<FilterAlt />}
          style={{ textTransform: "none" }}
        >
          Clear filters
        </Button>
      )}
    </EmptyStateContainer>
  )

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <ContentBox elevation={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            mb: 2,
            gap: { xs: 2, sm: 0 },
          }}
        >
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
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            <ImageIcon fontSize="large" sx={{ color: "#9C27B0", marginRight: "10px" }} /> Projects Gallery
          </Typography>

          <Link to="/addProject" style={{ textDecoration: "none" }}>
            <AddButton variant="contained">
              <Add /> Add project
            </AddButton>
          </Link>
        </Box>

        {/* Search and Filter Section */}
        {showSearchBox && (
          <Fade in={true} timeout={800}>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <FilterBox elevation={1}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    width: "100%",
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#673AB7",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    <Search fontSize="small" /> Search & Filter
                  </Typography>

                  <Button
                    size="small"
                    onClick={clearFilters}
                    disabled={!searchTerm && selectedCategoryId === null}
                    sx={{ textTransform: "none" }}
                  >
                    Clear filters
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                    mt: { xs: 2, sm: 2 },
                  }}
                >
                  <TextField
                    fullWidth
                    label="Search projects"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    select
                    fullWidth
                    label="Filter by category"
                    variant="outlined"
                    size="small"
                    value={selectedCategoryId ?? ""}
                    onChange={(e) => setSelectedCategoryId(e.target.value === "" ? null : Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* Filter stats */}
                <Box
                  sx={{
                    mt: 2,
                    width: "100%",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {filteredImages.length} {filteredImages.length === 1 ? "project" : "projects"} found
                  </Typography>

                  {(searchTerm || selectedCategoryId !== null) && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {searchTerm && (
                        <Chip
                          size="small"
                          label={`Search: ${searchTerm}`}
                          onDelete={() => setSearchTerm("")}
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                      {selectedCategoryId !== null && (
                        <Chip
                          size="small"
                          label={`Category: ${categories.find((c) => c.id === selectedCategoryId)?.categoryName}`}
                          onDelete={() => setSelectedCategoryId(null)}
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}
                </Box>
              </FilterBox>
            </Box>
          </Fade>
        )}

        {/* Main Content */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              margin: "-10px", // Counteract the margin of the cards
            }}
          >
            {renderSkeletons()}
          </Box>
        ) : !hasFilteredResults ? (
          renderEmptyState()
        ) : (
          <Fade in={true} timeout={1000}>
            <Box>
              {categories.map((category) => {
                const categoryImages = filteredImages
                  .filter((img) => img.category.id === category.id)
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

                if (categoryImages.length === 0) return null

                return (
                  <Box key={category.id} sx={{ mb: 6 }}>
                    <Box sx={{ mb: 3 }}>
                      <CategoryTitle
                        variant="h4"
                        sx={{
                          fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        {category.categoryName}
                      </CategoryTitle>
                      {category.description && (
                        <CategoryDescription sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}>
                          {category.description}
                        </CategoryDescription>
                      )}
                      <Divider sx={{ mb: 3, width: "100px", borderColor: "#e0e0e0" }} />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        margin: "-10px", // Counteract the margin of the cards
                        justifyContent: { xs: "center", sm: "flex-start" },
                      }}
                    >
                      {categoryImages.map((image) => (
                        <Fade key={image.id} in={true} timeout={500}>
                          <Box
                            sx={{
                              width: {
                                xs: "100%",
                                sm: "calc(50% - 20px)",
                                md: "calc(33.333% - 20px)",
                                lg: "calc(33.333% - 20px)",
                              },
                              padding: "10px",
                            }}
                          >
                            <ProjectCard sx={{ height: "100%" }}>
                              <ImageContainer onClick={() => handleImageClick(image)}>
                                <CardMedia
                                  component="img"
                                  height="200"
                                  image={image.linkURL}
                                  alt={image.fileName}
                                  sx={{
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.5s ease",
                                    "&:hover": {
                                      transform: "scale(1.1)",
                                    },
                                  }}
                                />
                              </ImageContainer>
                              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: "bold",
                                    mb: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                                  }}
                                >
                                  {image.fileName}
                                </Typography>

                                {image.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      mb: 2,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      minHeight: "40px",
                                    }}
                                  >
                                    {image.description}
                                  </Typography>
                                )}

                                <Box sx={{ mt: "auto" }}>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "gray",
                                      display: "block",
                                      mb: 2,
                                      fontSize: "11px",
                                    }}
                                  >
                                    <span style={{ fontWeight: "bold" }}>Created at:</span>{" "}
                                    {new Date(image.createdAt).toLocaleDateString()}
                                    <br />
                                    <span style={{ fontWeight: "bold" }}>Last updated:</span>{" "}
                                    {new Date(image.updatedAt).toLocaleDateString()}
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      gap: 1,
                                    }}
                                  >
                                    <EditButton
                                      variant="outlined"
                                      size="small"
                                      onClick={() => handleEdit(image)}
                                      fullWidth
                                    >
                                      <Edit fontSize="small" /> Edit
                                    </EditButton>

                                    {isDeleting && image.id === imageId1 ? (
                                      <DeleteButton variant="outlined" size="small" disabled fullWidth>
                                        <CircularProgress size={16} sx={{ color: "gray", mr: 1 }} />
                                        Deleting...
                                      </DeleteButton>
                                    ) : (
                                      <DeleteButton
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleDeleteClick(image)}
                                        fullWidth
                                      >
                                        <Delete fontSize="small" /> Delete
                                      </DeleteButton>
                                    )}
                                  </Box>
                                </Box>
                              </CardContent>
                            </ProjectCard>
                          </Box>
                        </Fade>
                      ))}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Fade>
        )}
      </ContentBox>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            position: "relative",
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "white",
            bgcolor: "rgba(0,0,0,0.3)",
            zIndex: 10,
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.5)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            p: { xs: 1, sm: 2 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: { xs: "auto", sm: "90vh" },
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <img
            src={selectedImage?.linkURL ?? ""}
            alt={selectedImage?.fileName ?? "Project image"}
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              borderRadius: "4px",
            }}
          />

          {selectedImage && (
            <Box
              sx={{
                mt: 2,
                textAlign: "center",
                maxWidth: "100%",
                px: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  wordBreak: "break-word",
                }}
              >
                {selectedImage.fileName}
              </Typography>
              {selectedImage.description && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    wordBreak: "break-word",
                  }}
                >
                  {selectedImage.description}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: "bold", color: "#F06292" }}>Delete Project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{imageToDelete?.fileName}</strong>?
            <br />
            <br />
            <Box sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", p: 2, borderRadius: 2 }}>
              <Typography variant="body2" color="error" sx={{ fontWeight: "medium" }}>
                Warning: This action cannot be undone.
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 0 } }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              borderColor: "purple",
              color: "purple",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                borderColor: "gray",
                backgroundColor: "rgba(251, 225, 255, 0.36)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Delete Project
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

export default ImageGallery
