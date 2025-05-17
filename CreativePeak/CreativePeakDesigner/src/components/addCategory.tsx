import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  Fade,
  Alert,
  Tooltip,
  Chip,
  Card,
  CardContent,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { styled } from "@mui/system"
import {
  Category as CategoryIcon,
  Save,
  Close,
  Info as InfoIcon,
  Label as LabelIcon,
  Description as DescriptionIcon,
  ArrowBack,
  AutoAwesome as AutoAwesomeIcon,
  Check as CheckIcon,
} from "@mui/icons-material"
import type Category from "../models/category"
import { useAuth } from "../contexts/authContext"
import AutoSnackbar from "./snackbar"
import { useLocation, useNavigate } from "react-router-dom"

const ContentBox = styled(Paper)(() => ({
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  borderRadius: "16px",
  padding: "40px",
  maxWidth: "550px",
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

const AiSuggestionButton = styled(Button)(() => ({
  marginLeft: '10px',
  borderRadius: '10px',
  textTransform: 'none',
  padding: '8px 12px',
  background: 'linear-gradient(45deg, #AB47BC 30%, #CE93D8 90%)',
  color: 'white',
  fontSize: '14px',
  minWidth: 'auto',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 5px rgba(156,39,176,0.3)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(156,39,176,0.5)',
    background: 'linear-gradient(45deg, #9C27B0 30%, #AB47BC 90%)',
  },
}))

interface AddCategoryFormProps {
  categoryToEdit?: Category | null
  onClose?: () => void
  onSuccess?: (newCategory: Category) => void
}

const AddCategoryForm = ({ categoryToEdit = null, onClose, onSuccess }: AddCategoryFormProps) => {
  const location = useLocation();
  const categoryToEditFromRoute = location.state?.category || null;
  const finalCategoryToEdit = categoryToEdit || categoryToEditFromRoute;
  const { userId } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
    setValue,
  } = useForm<Category>({
    mode: "onChange",
    defaultValues: {
      categoryName: finalCategoryToEdit?.categoryName || "",
      description: finalCategoryToEdit?.description || "",
    },
  })

  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [userCategories, setUserCategories] = useState<Category[]>([])
  const [nameExists, setNameExists] = useState(false)
  const [showExistingCategories, setShowExistingCategories] = useState(false)

  // AI description states
  const [aiDescriptionOpen, setAiDescriptionOpen] = useState(false)
  const [aiDescriptionLoading, setAiDescriptionLoading] = useState(false)
  const [aiDescription, setAiDescription] = useState("")

  const navigate = useNavigate();

  const watchCategoryName = watch("categoryName")

  // Load user categories
  useEffect(() => {
    const fetchUserCategories = async () => {
      try {
        const response = await axios.get(`https://creativepeak-api.onrender.com/api/Category`)
        const uCategories = response.data.filter((category: Category) => category.userId == userId)
        setUserCategories(uCategories);
      } catch (error) {
        console.error("Failed to load categories", error)
        setSnackbarMsg("❌ Failed to load existing categories")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    }

    if (userId) {
      fetchUserCategories()
    }
  }, [userId])

  // Check if category name already exists
  useEffect(() => {
    if (!watchCategoryName || !userCategories.length) return

    const trimmedName = watchCategoryName.trim().toLowerCase()
    const exists = userCategories.some(
      (cat) =>
        cat.categoryName.trim().toLowerCase() === trimmedName &&
        (!finalCategoryToEdit || cat.id !== finalCategoryToEdit.id),
    )

    setNameExists(exists)
  }, [watchCategoryName, userCategories, finalCategoryToEdit])

  // Fill form with existing data if editing
  useEffect(() => {
    if (finalCategoryToEdit) {
      reset({
        categoryName: finalCategoryToEdit.categoryName,
        description: finalCategoryToEdit.description,
      })
    }
  }, [finalCategoryToEdit, reset])

  const onSubmit = async (data: Category) => {
    if (nameExists) return

    setLoading(true)
    const dataToSubmit = { ...data, userId }

    try {
      if (finalCategoryToEdit) {
        await axios.put(`https://creativepeak-api.onrender.com/api/Category/${finalCategoryToEdit.id}`, dataToSubmit)
        setSnackbarMsg("🎉 Category updated successfully!")
      } else {
        await axios.post("https://creativepeak-api.onrender.com/api/Category", dataToSubmit)
        setSnackbarMsg("🎉 Category added successfully!")
      }

      setSnackbarSeverity("success")
      setSnackbarOpen(true)

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(dataToSubmit as Category);
      } else {
        // Navigate after a short delay if no callback
        setTimeout(() => navigate("/categories"), 1500)
      }
    } catch (error) {
      console.error("Error saving category", error)
      setSnackbarMsg("❌ Error saving category. Please try again.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onClose) onClose()
    else {
      navigate("/categories");
    }
  }

  const toggleExistingCategories = () => {
    setShowExistingCategories(!showExistingCategories)
  }

  // New function to handle AI description suggestion
  const handleGetAiDescription = async () => {
    if (!watchCategoryName || watchCategoryName.trim() === "") {
      setSnackbarMsg("❌ Please enter a category name first");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setAiDescriptionLoading(true);
    setAiDescriptionOpen(true);

    try {
      // Making the actual API call to the AI service
      const response = await axios.post(
        "https://creativepeak-api.onrender.com/api/Ai/AI-description", 
        watchCategoryName, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setAiDescription(response.data);
    } catch (err) {
      console.error("Error generating AI description", err);
      setSnackbarMsg("❌ Failed to generate description. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setAiDescriptionOpen(false);
    } finally {
      setAiDescriptionLoading(false);
    }
  };

  // Function to apply the AI suggestion to the description field
  const applyAiDescription = () => {
    setValue("description", aiDescription);
    setAiDescriptionOpen(false);
    setSnackbarMsg("✓ AI description applied");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <ContentBox elevation={3}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={handleCancel}
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
          <CategoryIcon fontSize="large" sx={{ color: "#9C27B0" }} />
          {categoryToEdit ? "Edit Category" : "Add Category"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {userCategories.length > 0 && !categoryToEdit && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "#666" }}>
              You have {userCategories.length} existing {userCategories.length === 1 ? "category" : "categories"}
            </Typography>
            <Button
              size="small"
              onClick={toggleExistingCategories}
              endIcon={showExistingCategories ? <Close fontSize="small" /> : <InfoIcon fontSize="small" />}
              sx={{ textTransform: "none", color: "purple" }}
            >
              {showExistingCategories ? "Hide" : "Show"} existing
            </Button>
          </Box>

          {showExistingCategories && (
            <Fade in={showExistingCategories}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  p: 2,
                  bgcolor: "rgba(0,0,0,0.02)",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                {userCategories.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.categoryName}
                    size="small"
                    icon={<LabelIcon fontSize="small" />}
                    sx={{
                      bgcolor: "white",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      "&:hover": { boxShadow: "0 2px 5px rgba(0,0,0,0.15)" },
                    }}
                  />
                ))}
              </Box>
            </Fade>
          )}
        </Box>
      )}

      <FormCard>
        <CategoryBadge label="Category Details" icon={<CategoryIcon style={{ fontSize: 16, color: "white" }} />} />
        <FormCardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <StyledTextField
              label="Category Name"
              placeholder="Enter a unique category name"
              {...register("categoryName", {
                required: "Category name is required",
              })}
              fullWidth
              error={!!errors.categoryName || nameExists}
              helperText={errors.categoryName?.message || (nameExists ? "This category name already exists" : "")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LabelIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Get AI description suggestion">
                      <AiSuggestionButton
                        onClick={handleGetAiDescription}
                        startIcon={<AutoAwesomeIcon />}
                        size="small"
                        disabled={!watchCategoryName || watchCategoryName.trim() === ""}
                      >
                        AI Description
                      </AiSuggestionButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              label="Description"
              placeholder="Describe what this category will contain"
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

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, gap: 2 }}>
              <Tooltip
                title={
                  nameExists
                    ? "Please choose a different category name"
                    : !isValid
                      ? "Fill in the category details"
                      : ""
                }
                placement="top"
              >
                <span style={{ flex: 2 }}>
                  <PrimaryButton
                    type="submit"
                    fullWidth
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    disabled={loading || nameExists || !isValid}
                  >
                    {loading ? "Saving..." : categoryToEdit ? "Save Changes" : "Create Category"}
                  </PrimaryButton>
                </span>
              </Tooltip>

              <SecondaryButton type="button" onClick={handleCancel} startIcon={<Close />} sx={{ flex: 1 }}>
                Cancel
              </SecondaryButton>
            </Box>

            {!isValid && isDirty && (
              <FormHelperText error sx={{ textAlign: "center", mt: 1 }}>
                Please fill all required fields correctly
              </FormHelperText>
            )}
          </form>
        </FormCardContent>
      </FormCard>

      {!categoryToEdit && (
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            mt: 3,
            borderRadius: 2,
            fontSize: "0.9rem",
            borderColor: "purple",
            color: "purple",
          }}
        >
          Categories help you organize your projects. Create meaningful categories to group related projects together.
        </Alert>
      )}

      {/* AI Description Dialog */}
      <Dialog
        open={aiDescriptionOpen}
        onClose={() => setAiDescriptionOpen(false)}
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '10px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #9C27B0 30%, #AB47BC 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 'bold'
        }}>
          <AutoAwesomeIcon sx={{ color: '#9C27B0' }} /> AI Description Suggestion
        </DialogTitle>
        <DialogContent sx={{ minWidth: '400px', maxWidth: '600px' }}>
          {aiDescriptionLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px', flexDirection: 'column', gap: 2 }}>
              <CircularProgress size={50} thickness={4} color="secondary" />
              <Typography variant="body2" color="text.secondary">
                Generating creative description...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ my: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(156, 39, 176, 0.05)',
                  border: '1px solid rgba(156, 39, 176, 0.2)'
                }}
              >
                <Typography variant="body1">{aiDescription}</Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => setAiDescriptionOpen(false)}
            startIcon={<Close />}
            sx={{
              color: '#666',
              textTransform: 'none',
              borderRadius: '8px'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={applyAiDescription}
            disabled={aiDescriptionLoading}
            startIcon={<CheckIcon />}
            sx={{
              background: 'linear-gradient(45deg, #9C27B0 30%, #AB47BC 90%)',
              color: 'white',
              textTransform: 'none',
              boxShadow: '0 2px 5px rgba(156,39,176,0.3)',
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                boxShadow: '0 4px 8px rgba(156,39,176,0.5)',
                background: 'linear-gradient(45deg, #7B1FA2 30%, #9C27B0 90%)',
              },
            }}
          >
            Use This Description
          </Button>
        </DialogActions>
      </Dialog>

      <AutoSnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </ContentBox>
  )
}

export default AddCategoryForm