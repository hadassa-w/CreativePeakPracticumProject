import { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography, Box, Button, TextField, CircularProgress, Container,
  Card, Avatar, Divider, InputAdornment
} from "@mui/material";
import {
  EditOutlined, SaveOutlined, PersonOutline, EmailOutlined, PhoneOutlined,
  LanguageOutlined, WorkOutlineOutlined, AttachMoneyOutlined, ArrowBackOutlined
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/authContext";
import AutoSnackbar from "./snackbar";
import DesignerDetails from "../models/designerDetails";

function DesignerDetailsForm() {
  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<DesignerDetails>({ mode: "onChange" });
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [designerDetails, setDesignerDetails] = useState<DesignerDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useAuth();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  // Function to show snackbar message
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    axios.get("https://creativepeak-api.onrender.com/api/DesignerDetails")
      .then(response => {
        const filteredData = response.data.find((d: DesignerDetails) => d.userId === userId);
        if (filteredData) {
          setDesignerDetails(filteredData);
          Object.keys(filteredData).forEach(key =>
            setValue(key as keyof DesignerDetails, filteredData[key as keyof DesignerDetails])
          );
        }
      })
      .catch(error => {
        console.error("Error fetching designer details", error);
        showSnackbar("Error loading designer details", "error");
      })
      .finally(() => setInitialLoading(false));
  }, [userId, setValue]);

  const onSubmit = async (data: DesignerDetails) => {
    setSaving(true);
    const designerData = { ...data, userId };

    try {
      if (designerDetails) {
        await axios.put(
          `https://creativepeak-api.onrender.com/api/DesignerDetails/${designerDetails.id}`,
          designerData
        );
      } else {
        await axios.post(
          "https://creativepeak-api.onrender.com/api/DesignerDetails",
          designerData
        );
      }

      showSnackbar("Designer details saved successfully! 🎉", "success");

      // Refresh data after saving
      const updatedResponse = await axios.get("https://creativepeak-api.onrender.com/api/DesignerDetails");
      const updatedData = updatedResponse.data.find((d: DesignerDetails) => d.userId === userId);
      setDesignerDetails(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      showSnackbar("Failed to save designer details", "error");
    } finally {
      setSaving(false);
    }
  };

  // Render loading screen
  if (initialLoading) {
    return (
      <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#673AB7", mb: 3 }} />
          <Typography variant="h6" sx={{ color: "#666" }}>Loading designer details...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "80vh"
      }}>
        {/* Designer details card */}
        <Card
          elevation={5}
          sx={{
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            transition: "all 0.3s ease",
            background: "linear-gradient(to bottom, #f9f9ff, #ffffff)",
            position: "relative"
          }}
        >
          {/* Card header */}
          <Box
            sx={{
              height: 150,
              p: 3,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "linear-gradient(145deg, #673AB7 0%, #9c27b0 100%)",
              position: "relative"
            }}
          >
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#fff",
                color: "#673AB7",
                fontSize: 40,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                border: "4px solid #fff",
                mb: 2
              }}
            >
              <WorkOutlineOutlined fontSize="medium" />
            </Avatar>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 600, textTransform: "none" }}>
              Designer Profile
            </Typography>
          </Box>

          {/* Card content */}
          <Box sx={{ p: 4, pt: 3 }}>
            {isEditing || !designerDetails ? (
              // Edit mode - form
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {!designerDetails && (
                    <Typography variant="h6" sx={{ textAlign: "center", mb: 1, color: "#673AB7" }}>
                      Please enter your business information
                    </Typography>
                  )}

                  {/* Full name */}
                  <TextField
                    label="Full Name"
                    {...register("fullName", { required: "Full name is required" })}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message?.toString()}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PersonOutline sx={{ color: "#673AB7" }} /></InputAdornment>
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#9c27b0" },
                        "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                      }
                    }}
                  />

                  {/* Email */}
                  <TextField
                    label="Email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    error={!!errors.email}
                    helperText={errors.email?.message?.toString()}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ color: "#673AB7" }} /></InputAdornment>
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#9c27b0" },
                        "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                      }
                    }}
                  />

                  {/* Website Address */}
                  <TextField
                    label="Website Address"
                    {...register("addressSite")}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LanguageOutlined sx={{ color: "#673AB7" }} /></InputAdornment>
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#9c27b0" },
                        "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                      }
                    }}
                  />

                  {/* Phone */}
                  <TextField
                    label="Phone"
                    type="tel"
                    {...register("phone", { required: "Phone is required" })}
                    error={!!errors.phone}
                    helperText={errors.phone?.message?.toString()}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PhoneOutlined sx={{ color: "#673AB7" }} /></InputAdornment>
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#9c27b0" },
                        "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                      }
                    }}
                  />

                  {/* Years of Experience */}
                  <TextField
                    label="Years of Experience"
                    type="number"
                    {...register("yearsExperience", {
                      required: "Years of experience is required",
                      min: { value: 0, message: "Value must be positive" }
                    })}
                    error={!!errors.yearsExperience}
                    helperText={errors.yearsExperience?.message?.toString()}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><WorkOutlineOutlined sx={{ color: "#673AB7" }} /></InputAdornment>
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#9c27b0" },
                        "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                      }
                    }}
                  />

                  {/* Price Range (Min & Max) */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="Minimum Price (₪)"
                      type="number"
                      {...register("priceRangeMin", {
                        required: "Minimum price is required",
                        min: { value: 0, message: "Value must be positive" }
                      })}
                      error={!!errors.priceRangeMin}
                      helperText={errors.priceRangeMin?.message?.toString()}
                      fullWidth
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><AttachMoneyOutlined sx={{ color: "#673AB7" }} /></InputAdornment>
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "#9c27b0" },
                          "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                        }
                      }}
                    />
                    <TextField
                      label="Maximum Price (₪)"
                      type="number"
                      {...register("priceRangeMax", {
                        required: "Maximum price is required",
                        min: { value: 0, message: "Value must be positive" },
                        valueAsNumber: true,
                        validate: (value, formValues) =>
                          value >= formValues.priceRangeMin || "Max price must be greater than min price"
                      })}
                      error={!!errors.priceRangeMax}
                      helperText={errors.priceRangeMax?.message?.toString()}
                      fullWidth
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><AttachMoneyOutlined sx={{ color: "#673AB7" }} /></InputAdornment>
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "#9c27b0" },
                          "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                        }
                      }}
                    />
                  </Box>

                  {/* Action buttons */}
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    {designerDetails && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setIsEditing(false)}
                        startIcon={<ArrowBackOutlined />}
                        sx={{
                          borderRadius: 2,
                          py: 1.2,
                          flex: 1,
                          borderColor: "#673AB7",
                          color: "#673AB7",
                          "&:hover": {
                            borderColor: "#9c27b0",
                            bgcolor: "rgba(103, 58, 183, 0.04)"
                          },
                          textTransform: "none"
                        }}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!isValid || saving}
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveOutlined />}
                      sx={{
                        borderRadius: 2,
                        py: 1.2,
                        flex: designerDetails ? 2 : 1,
                        bgcolor: "#673AB7",
                        color: "white",
                        boxShadow: "0 4px 10px rgba(103, 58, 183, 0.3)",
                        "&:hover": {
                          bgcolor: "#9c27b0",
                          boxShadow: "0 6px 15px rgba(103, 58, 183, 0.4)"
                        },
                        textTransform: "none"
                      }}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                </Box>
              </form>
            ) : (
              // View mode - designer details
              <Box sx={{ py: 1,width:"350px" }}>
                {/* Full name */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{
                    bgcolor: "rgba(103, 58, 183, 0.1)",
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    mr: 2
                  }}>
                    <PersonOutline sx={{ color: "#673AB7" }} />
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Full Name
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {designerDetails.fullName}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Email */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{
                    bgcolor: "rgba(103, 58, 183, 0.1)",
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    mr: 2
                  }}>
                    <EmailOutlined sx={{ color: "#673AB7" }} />
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {designerDetails.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Phone */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{
                    bgcolor: "rgba(103, 58, 183, 0.1)",
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    mr: 2
                  }}>
                    <PhoneOutlined sx={{ color: "#673AB7" }} />
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Phone
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {designerDetails.phone}
                    </Typography>
                  </Box>
                </Box>

                {/* Website address - if exists */}
                {designerDetails.addressSite && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{
                        bgcolor: "rgba(103, 58, 183, 0.1)",
                        borderRadius: "50%",
                        p: 1.5,
                        display: "flex",
                        mr: 2
                      }}>
                        <LanguageOutlined sx={{ color: "#673AB7" }} />
                      </Box>
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                          Website
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {designerDetails.addressSite}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Years of Experience */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{
                    bgcolor: "rgba(103, 58, 183, 0.1)",
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    mr: 2
                  }}>
                    <WorkOutlineOutlined sx={{ color: "#673AB7" }} />
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Experience
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {designerDetails.yearsExperience} years
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Price Range */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{
                    bgcolor: "rgba(103, 58, 183, 0.1)",
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    mr: 2
                  }}>
                    <AttachMoneyOutlined sx={{ color: "#673AB7" }} />
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Price Range
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {designerDetails.priceRangeMin}₪ - {designerDetails.priceRangeMax}₪
                    </Typography>
                  </Box>
                </Box>

                {/* Edit button */}
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    startIcon={<EditOutlined />}
                    sx={{
                      borderRadius: 8,
                      py: 1.2,
                      px: 4,
                      bgcolor: "#673AB7",
                      color: "white",
                      boxShadow: "0 4px 10px rgba(103, 58, 183, 0.3)",
                      "&:hover": {
                        bgcolor: "#9c27b0",
                        boxShadow: "0 6px 15px rgba(103, 58, 183, 0.4)",
                        transform: "translateY(-2px)"
                      },
                      transition: "all 0.3s ease",
                      textTransform: "none",
                    }}
                  >
                    Edit Designer Details
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Card>
      </Box>

      {/* Snackbar notification */}
      <AutoSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </Container>
  );
}

export default DesignerDetailsForm;