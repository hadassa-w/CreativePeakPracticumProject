import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Chip,
  Tooltip,
  Alert,
  Card,
  CardContent,
} from "@mui/material"
import { styled } from "@mui/system"
import { useLocation, useNavigate } from "react-router-dom"
import FileUploader from "../AWS/s3Image"
import type Category from "../models/category"
import type Project from "../models/project"
import { useAuth } from "../contexts/authContext"
import AutoSnackbar from "./snackbar"
import {
  Add,
  ArrowBack,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material"
import type Image from "../models/image"
import AddCategoryForm from "./addCategory"

const ContentBox = styled(Paper)(() => ({
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  borderRadius: "20px",
  padding: "40px",
  maxWidth: "650px",
  width: "100%",
  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.15)",
  },
}))

const StyledButton = styled(Button)(() => ({
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "10px",
  padding: "12px 24px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
  },
}))

const PrimaryButton = styled(StyledButton)(() => ({
  background: "linear-gradient(45deg, #9C27B0 30%, #AB47BC 90%)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #7B1FA2 30%, #9C27B0 90%)",
  },
}))

const SecondaryButton = styled(StyledButton)(() => ({
  backgroundColor: "#f5f5f5",
  color: "#666",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
}))

const AddCategoryButton = styled(Button)(() => ({
  textTransform: "none",
  fontSize: "15px",
  borderRadius: "8px",
  padding: "8px 16px",
  transition: "all 0.3s ease",
  background: "linear-gradient(45deg, #9C27B0 30%, #AB47BC 90%)",
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    background: "linear-gradient(45deg, #7B1FA2 30%, #9C27B0 90%)",
  },
}))

const StyledTextField = styled(TextField)(() => ({
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
  "& .MuiInputLabel-root": {
    fontSize: "15px",
  },
}))

const StyledFormControl = styled(FormControl)(() => ({
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
  "& .MuiInputLabel-root": {
    fontSize: "15px",
  },
}))

const FormCard = styled(Card)(() => ({
  marginTop: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  overflow: "visible",
  position: "relative",
}))

const FormCardContent = styled(CardContent)(() => ({
  padding: "30px 24px",
}))

const CategoryBadge = styled(Chip)(() => ({
  position: "absolute",
  top: "-12px",
  left: "24px",
  padding: "0 8px",
  height: "28px",
  background: "linear-gradient(45deg, #9C27B0 30%, #AB47BC 90%)",
  color: "white",
  fontWeight: "bold",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
}))

const OverlayContainer = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1300,
  backdropFilter: "blur(5px)",
}))

const LinearProgressStyled = styled('div')(() => ({
  width: '100%',
  height: '5px',
  borderRadius: '3px',
  backgroundColor: '#e0e0e0',
  position: 'relative',
  marginTop: '10px',
  marginBottom: '10px',
  overflow: 'hidden',
  '& .progress-bar': {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#9C27B0',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
}));

const AddImageForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<Project>({
    mode: "onChange",
  })

  const [newLoading, setNewLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [userImages, setUserImages] = useState<Project[]>([])
  const { userId } = useAuth()
  const location = useLocation()
  const image = location.state?.image || null
  const navigate = useNavigate()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [nameExists, setNameExists] = useState(false)
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(image?.linkURL || null)

  // Category form overlay state
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  const watchFileName = watch("fileName")

  const fetchCategories = async () => {
    try {
      setLoading(false);
      const response = await axios.get(`https://creativepeak-api.onrender.com/api/Category`)
      const filterCategory = response.data.filter((category: Category) => category.userId == userId)
      setCategories(filterCategory)
    } catch (err) {
      console.error("Error loading categories", err)
      setSnackbarMsg("❌ Failed to load categories. Please try again.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, imgRes] = await Promise.all([
          axios.get(`https://creativepeak-api.onrender.com/api/Category`),
          axios.get(`https://creativepeak-api.onrender.com/api/Image`),
        ])
        const filterCategory = catRes.data.filter((category: Category) => category.userId == userId)
        const filterImages = imgRes.data.filter((image: Image) => image.user.id == userId)
        setCategories(filterCategory)
        setUserImages(filterImages)
      } catch (err) {
        console.error("Error loading data", err)
        setSnackbarMsg("❌ Failed to load data. Please try again.")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } finally {
        setNewLoading(false)
      }
    }

    if (userId) fetchData()
  }, [userId])

  useEffect(() => {
    if (image) {
      setValue("fileName", image.fileName)
      setValue("description", image.description)
      setValue("categoryId", image.category.id)
      setImagePreview(image.linkURL)
    }
  }, [image, setValue])

  // Check if project name already exists
  useEffect(() => {
    if (!watchFileName || !userImages.length) return

    const trimmedName = watchFileName.trim().toLowerCase()
    const exists = userImages.some(
      (img) => img.fileName.trim().toLowerCase() === trimmedName && (!image || img.id !== image.id),
    )

    setNameExists(exists)
  }, [watchFileName, userImages, image])

  // Handle file selection
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  }

  // Handle preview change
  const handlePreviewChange = (preview: string | null) => {
    setImagePreview(preview);
  }

  // Upload file to AWS S3
  const uploadFileToS3 = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const response = await axios.get('https://creativepeak-api.onrender.com/api/S3Images/image-url', {
        params: { fileName: uniqueFileName }
      });
      const presignedUrl = response.data.url;

      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent);
        },
      });

      const s3BaseUrl = "https://s3.us-east-1.amazonaws.com/creativepeakproject.aws-testpnoren/";
      const imageUrl = `${s3BaseUrl}${encodeURIComponent(uniqueFileName)}`;
      
      setUploadProgress(100);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: Project) => {
    if (nameExists) return;

    setLoading(true);
    
    try {
      let linkURL = image?.linkURL;
      
      // If there's a new file selected, upload it first
      if (selectedFile) {
        try {
          linkURL = await uploadFileToS3(selectedFile);
        } catch (err) {
          setSnackbarMsg("❌ Failed to upload image. Please try again.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      } else if (!linkURL) {
        // No file selected and no existing URL
        setSnackbarMsg("❌ Please select an image");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      const dataToSubmit = {
        ...data,
        linkURL,
        userId,
      };

      if (image) {
        await axios.put(`https://creativepeak-api.onrender.com/api/Image/${image.id}`, dataToSubmit);
        setSnackbarMsg("🎉 Project updated successfully!");
      } else {
        await axios.post("https://creativepeak-api.onrender.com/api/Image", dataToSubmit);
        setSnackbarMsg("🎉 Project added successfully!");
      }

      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => navigate("/projects"), 1500);
      reset();
    } catch (err) {
      console.error("Error saving project", err);
      setSnackbarMsg("❌ Error saving project. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  }

  const handleAddCategory = () => {
    setShowCategoryForm(true);
  }

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false);
  }

  const handleCategoryFormSuccess = () => {
    // Refresh the categories list
    fetchCategories();
    setShowCategoryForm(false);

    // Show success message
    setSnackbarMsg("🎉 Category added successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }

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
      <ContentBox elevation={3}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton
            onClick={() => navigate("/projects")}
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
            <ImageIcon fontSize="large" sx={{ color: "#9C27B0" }} />
            {image ? "Edit Project" : "Add Project"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {newLoading ? (
          <CircularProgress size={60} thickness={5} color="secondary" />
        ) : (
          categories.length === 0 && (
            <Alert
              severity="warning"
              variant="outlined"
              sx={{
                mb: 3,
                borderRadius: 2,
                fontSize: "0.9rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                No categories found
              </Typography>
              You need to create a category before adding a project.<br />
              Categories help you organize your projects.
            </Alert>
          )
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: "#666", fontWeight: "medium" }}>
            {categories.length > 0
              ? `You have ${categories.length} ${categories.length === 1 ? "category" : "categories"} available`
              : "Create your first category to get started"}
          </Typography>

          <Tooltip title="Add a new category">
            <AddCategoryButton variant="contained" onClick={handleAddCategory}>
              <Add fontSize="small" /> Add Category
            </AddCategoryButton>
          </Tooltip>
        </Box>

        <FormCard>
          <CategoryBadge label="Project Details" icon={<ImageIcon style={{ fontSize: 16, color: "white" }} />} />
          <FormCardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <StyledTextField
                label="Project Name"
                placeholder="Enter a unique project name"
                {...register("fileName", {
                  required: "Project name is required",
                })}
                fullWidth
                error={!!errors.fileName || nameExists}
                helperText={errors.fileName?.message || (nameExists ? "This project name already exists" : "")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                label="Description"
                placeholder="Describe your project"
                {...register("description", {
                  required: "Description is required",
                })}
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <DescriptionIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledFormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>Category</InputLabel>
                <Select
                  {...register("categoryId", { required: "Category is required" })}
                  value={watch("categoryId") || ""}
                  onChange={(e) => setValue("categoryId", Number(e.target.value))}
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon fontSize="small" color="action" />
                    </InputAdornment>
                  }
                  disabled={categories.length === 0}
                >
                  <MenuItem value="" disabled>
                    {categories.length === 0 ? "No categories available" : "Select a category"}
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.categoryId?.message || (categories.length === 0 && "Please create a category first")}
                </FormHelperText>
              </StyledFormControl>

              <Box sx={{ mb: 3, mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 1,
                    color: "#666",
                  }}
                >
                  <ImageIcon fontSize="small" />
                  Project Image
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    borderColor: imagePreview ? "#9C27B0" : "rgba(0, 0, 0, 0.12)",
                    borderWidth: imagePreview ? 2 : 1,
                    transition: "all 0.3s ease",
                    bgcolor: imagePreview ? "rgba(156, 39, 176, 0.05)" : "transparent",
                  }}
                >
                  <FileUploader 
                    existingImageUrl={image?.linkURL} 
                    onFileChange={handleFileChange}
                    onPreviewChange={handlePreviewChange}
                  />
                </Paper>
              </Box>
              
              {isUploading && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#673AB7', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUploadIcon fontSize="small" />
                    Uploading image... {uploadProgress}%
                  </Typography>
                  <LinearProgressStyled>
                    <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                  </LinearProgressStyled>
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 2 }}>
                <Tooltip
                  title={
                    nameExists
                      ? "Please choose a different project name"
                      : !isValid
                        ? "Fill in the project details"
                        : !imagePreview && !selectedFile
                          ? "Please select an image"
                          : ""
                  }
                  placement="top"
                >
                  <span style={{ flex: 2 }}>
                    <PrimaryButton
                      type="submit"
                      fullWidth
                      startIcon={loading || isUploading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={loading || isUploading}
                    >
                      {loading || isUploading ? "Processing..." : image ? "Save Changes" : "Create Project"}
                    </PrimaryButton>
                  </span>
                </Tooltip>

                <SecondaryButton type="button" onClick={handleCancel} startIcon={<CloseIcon />} sx={{ flex: 1 }}>
                  Cancel
                </SecondaryButton>
              </Box>
            </form>
          </FormCardContent>
        </FormCard>

        <Alert
          severity="info"
          variant="outlined"
          icon={<InfoIcon />}
          sx={{
            mt: 3,
            borderRadius: 2,
            borderColor: "purple",
            fontSize: "0.9rem",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
            Tips for projects
          </Typography>
          Use high-quality images and provide detailed descriptions to make your projects stand out.<br />
          Organizing them in meaningful categories will help you find them easily later.
        </Alert>
      </ContentBox>

      {/* Category Form Overlay */}
      {showCategoryForm && (
        <OverlayContainer>
          <AddCategoryForm onClose={handleCategoryFormClose} onSuccess={handleCategoryFormSuccess} />
        </OverlayContainer>
      )}

      <AutoSnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  )
}

export default AddImageForm