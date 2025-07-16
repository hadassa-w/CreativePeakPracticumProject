import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography, Box, Button, TextField, CircularProgress, Container,
  Card, Avatar, Divider, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Paper
} from "@mui/material";
import {
  EditOutlined, SaveOutlined, PersonOutline, EmailOutlined, PhoneOutlined,
  LanguageOutlined, WorkOutlineOutlined, AttachMoneyOutlined, ArrowBackOutlined,
  DescriptionOutlined, AutoAwesomeOutlined, CheckOutlined, CloseOutlined,
  ExpandMoreOutlined, ExpandLessOutlined
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/authContext";
import AutoSnackbar from "./snackbar";
import DesignerDetails from "../models/designerDetails";

function DesignerDetailsForm() {
  const { register, handleSubmit, setValue, watch, trigger, formState: { errors, isValid } } = useForm<DesignerDetails>({ mode: "onChange" });
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [designerDetails, setDesignerDetails] = useState<DesignerDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { userId, token } = useAuth();
  const navigate = useNavigate();

  const [aiDescriptionOpen, setAiDescriptionOpen] = useState(false);
  const [aiDescription, setAiDescription] = useState("");

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  const watchedValues = watch();

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const shouldTruncateDescription = (text: string) => {
    return text && text.length > 100;
  };

  const getTruncatedDescription = (text: string) => {
    if (!text) return "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  const generateAIDescription = async () => {
    const { fullName, yearsExperience } = watchedValues;

    if (!fullName || !yearsExperience) {
      showSnackbar("Please fill in name and experience to generate description", "error");
      return;
    }

    setGeneratingDescription(true);
    setAiDescriptionOpen(true);

    try {
      const prompt = `Write a professional and engaging bio description for a graphic designer named ${fullName}.
        Create a compelling 2-3 sentence description that highlights their creativity, professionalism, and passion for design.
        Make it sound personal and authentic.`;

      const response = await axios.post(
        'https://creativepeak-api.onrender.com/api/Ai/AI-description',
        prompt,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiDescriptionResult = response.data.description || response.data;
      setAiDescription(aiDescriptionResult);
    } catch (error) {
      console.error("Error generating AI description:", error);
      showSnackbar("Failed to generate AI description", "error");
      setAiDescriptionOpen(false);
    } finally {
      setGeneratingDescription(false);
    }
  };

  const applyAiDescription = async () => {
    setValue("description", aiDescription);
    await trigger("description");
    setAiDescriptionOpen(false);
    showSnackbar("✓ AI description applied", "success");
  };

  useEffect(() => {
    axios.get("https://creativepeak-api.onrender.com/api/DesignerDetails",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(response => {
        const filteredData = response.data.find((d: DesignerDetails) => d.userId === userId);
        if (filteredData) {
          setDesignerDetails(filteredData);
          Object.keys(filteredData).forEach(key =>
            setValue(key as keyof DesignerDetails, filteredData[key as keyof DesignerDetails])
          );
          setIsFirstVisit(false);
        } else {
          setIsFirstVisit(true);
        }
      })
      .catch(error => {
        console.error("Error fetching designer details", error);
        showSnackbar("Error loading designer details", "error");
        setIsFirstVisit(true);
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
          designerData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "https://creativepeak-api.onrender.com/api/DesignerDetails",
          designerData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      showSnackbar("Designer details saved successfully! 🎉", "success");

      const updatedResponse = await axios.get("https://creativepeak-api.onrender.com/api/DesignerDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = updatedResponse.data.find((d: DesignerDetails) => d.userId == userId);
      setDesignerDetails(updatedData);
      setIsEditing(false);

      if (isFirstVisit) {
        setTimeout(() => {
          navigate('/welcome');
        }, 2000);
      }

    } catch (error) {
      console.error("Error submitting data:", error);
      showSnackbar("Failed to save designer details", "error");
    } finally {
      setSaving(false);
    }
  };

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
    <>
      <Container maxWidth="sm">
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "80vh"
        }}>
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

            <Box sx={{ p: 4, pt: 3 }}>
              {isEditing || !designerDetails ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {!designerDetails && (
                      <Typography variant="h6" sx={{ textAlign: "center", mb: 1, color: "#673AB7" }}>
                        {isFirstVisit ? "Welcome! Please enter your business information" : "Please enter your business information"}
                      </Typography>
                    )}

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

                    <TextField
                      label="Years of Experience"
                      type="number"
                      {...register("yearsExperience", {
                        required: "Years of experience is required",
                        min: { value: 0, message: "Value must be positive" },
                        valueAsNumber: true,
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

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        label="Minimum Price (₪)"
                        type="number"
                        {...register("priceRangeMin", {
                          required: "Minimum price is required",
                          min: { value: 0, message: "Value must be positive" },
                          valueAsNumber: true,
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

                    <Box>
                      <TextField
                        label="Description"
                        {...register("description", { required: "Description is required" })}
                        error={!!errors.description}
                        helperText={errors.description?.message?.toString()}
                        fullWidth
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Describe your design services, specialties, and approach..."
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><DescriptionOutlined sx={{ color: "#673AB7" }} /></InputAdornment>
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#9c27b0" },
                            "&.Mui-focused fieldset": { borderColor: "#673AB7" }
                          }
                        }}
                      />

                      <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={generateAIDescription}
                          disabled={generatingDescription || !watchedValues.fullName || !watchedValues.yearsExperience}
                          startIcon={<AutoAwesomeOutlined />}
                          sx={{
                            borderRadius: 2,
                            borderColor: "#673AB7",
                            color: "#673AB7",
                            "&:hover": {
                              borderColor: "#9c27b0",
                              bgcolor: "rgba(103, 58, 183, 0.04)"
                            },
                            textTransform: "none"
                          }}
                        >
                          Generate with AI
                        </Button>
                      </Box>
                    </Box>

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
                        {saving ? "Saving..." : (isFirstVisit ? "Save & Continue" : "Save Changes")}
                      </Button>
                    </Box>

                    {isFirstVisit && (
                      <Typography variant="body2" sx={{ textAlign: "center", color: "#666", mt: 1 }}>
                        After saving your details, you'll be redirected to the home page.
                      </Typography>
                    )}
                  </Box>
                </form>
              ) : (
                <Box sx={{ py: 1, width: "400px" }}>
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
                        About {designerDetails.priceRangeMin}-{designerDetails.priceRangeMax}₪ Per project
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                        * Subject to change
                      </Typography>
                    </Box>
                  </Box>

                  {designerDetails.description && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <Box sx={{
                          bgcolor: "rgba(103, 58, 183, 0.1)",
                          borderRadius: "50%",
                          p: 1.5,
                          display: "flex",
                          mr: 2,
                          mt: 0.5
                        }}>
                          <DescriptionOutlined sx={{ color: "#673AB7" }} />
                        </Box>
                        <Box sx={{ textAlign: "left", flex: 1 }}>
                          <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                            Description
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                            {isDescriptionExpanded
                              ? designerDetails.description
                              : getTruncatedDescription(designerDetails.description)
                            }
                          </Typography>

                          {shouldTruncateDescription(designerDetails.description) && (
                            <Button
                              size="small"
                              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                              startIcon={isDescriptionExpanded ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                              sx={{
                                mt: 1,
                                color: "#673AB7",
                                textTransform: "none",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                p: 1,
                                minWidth: "auto",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#9c27b0"
                                }
                              }}
                            >
                              {isDescriptionExpanded ? "Show Less" : "Show More"}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </>
                  )}

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

        <AutoSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        />
      </Container>

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
          background: 'linear-gradient(45deg, #673AB7 30%, #9c27b0 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 'bold'
        }}>
          <AutoAwesomeOutlined sx={{ color: '#673AB7' }} /> AI Description Suggestion
        </DialogTitle>
        <DialogContent sx={{ minWidth: '400px', maxWidth: '600px' }}>
          {generatingDescription ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px', flexDirection: 'column', gap: 2 }}>
              <CircularProgress size={50} thickness={4} sx={{ color: '#673AB7' }} />
              <Typography variant="body2" color="text.secondary">
                Generating professional description...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ my: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(103, 58, 183, 0.05)',
                  border: '1px solid rgba(103, 58, 183, 0.2)'
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
            startIcon={<CloseOutlined />}
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
            disabled={generatingDescription}
            startIcon={<CheckOutlined />}
            sx={{
              background: 'linear-gradient(45deg, #673AB7 30%, #9c27b0 90%)',
              color: 'white',
              textTransform: 'none',
              boxShadow: '0 2px 5px rgba(103, 58, 183, 0.3)',
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                boxShadow: '0 4px 8px rgba(103, 58, 183, 0.5)',
                background: 'linear-gradient(45deg, #512DA8 30%, #673AB7 90%)',
              },
            }}
          >
            Use This Description
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DesignerDetailsForm;