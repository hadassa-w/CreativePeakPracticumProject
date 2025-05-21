import { Box, Typography, Button, Container, Paper, Grid, Avatar, Chip } from "@mui/material";
import { styled } from "@mui/system";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaletteIcon from "@mui/icons-material/Palette";
import CreateIcon from "@mui/icons-material/Create";
import BrushIcon from "@mui/icons-material/Brush";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

// עטיפת הדף - משופרת עם צבע רקע מעודן
const HomeWrapper = styled(Container)({
    backgroundColor: "#fcfaff", // רקע בהיר עם גוון סגול עדין
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(81, 45, 168, 0.1)",
    padding: "40px",
    maxWidth: "1200px",
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "6px",
        background: "linear-gradient(90deg, #7E57C2, #512da8)",
    }
});

// חלוקת תוכן פנימית
const Content = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "60px",
    marginTop: "30px",
});

// אזור מידע
const InfoSection = styled(Box)({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
});

// כרטיס מידע - משודרג
const InfoCard = styled(Paper)({
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05)",
    marginBottom: "10px",
    transition: "all 0.3s ease",
    border: "1px solid rgba(126, 87, 194, 0.1)",
    position: "relative",
    overflow: "hidden",
    width: "100%",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(81, 45, 168, 0.1)",
    },
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "3px",
        background: "linear-gradient(90deg, #7E57C2, #9575CD)",
        opacity: 0,
        transition: "opacity 0.3s ease",
    },
    "&:hover::after": {
        opacity: 1,
    }
});

// כרטיס פיצ'ר חדש
const FeatureCard = styled(Box)({
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    padding: "16px",
    marginBottom: "16px",
    borderRadius: "12px",
    transition: "transform 0.3s ease, background-color 0.3s ease",
    "&:hover": {
        backgroundColor: "rgba(126, 87, 194, 0.05)",
        transform: "translateX(5px)",
    }
});

// כפתור מעוצב - משודרג
const StyledButton = styled(Button)({
    textTransform: "none",
    fontSize: "17px",
    fontWeight: "600",
    borderRadius: "100px",
    padding: "12px 24px",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    border: "2px solid #512da8",
    color: "#512da8",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    maxWidth: "200px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 6px 15px rgba(81, 45, 168, 0.15)",
        backgroundColor: "#512da8",
        color: "white",
        border: "2px solid #512da8",
    },
    "& .MuiSvgIcon-root": {
        fontSize: "20px",
        transition: "transform 0.3s ease",
    },
    "&:hover .MuiSvgIcon-root": {
        transform: "scale(1.2)",
    }
});

// כפתור חינמי
const FreeButton = styled(Button)({
    textTransform: "none",
    fontSize: "17px",
    fontWeight: "600",
    borderRadius: "100px",
    padding: "12px 24px",
    transition: "all 0.3s ease",
    backgroundColor: "#673AB7",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    maxWidth: "200px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 6px 15px rgba(145, 76, 175, 0.3)",
        backgroundColor: "rgb(94, 31, 188)",
    },
    "& .MuiSvgIcon-root": {
        fontSize: "20px",
        transition: "transform 0.3s ease",
    },
    "&:hover .MuiSvgIcon-root": {
        transform: "scale(1.2)",
    }
});

// כותרת עם אפקט מודגש
const GradientTitle = styled(Typography)({
    position: "relative",
    display: "inline-block",
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: "-5px",
        left: "0",
        width: "100%",
        height: "3px",
        background: "linear-gradient(90deg, #7E57C2, #9575CD)",
        borderRadius: "2px",
    }
});

// כרטיס סטטיסטיקה
const StatCard = styled(Paper)({
    padding: "25px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(126, 87, 194, 0.1)",
    height: "100%",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(81, 45, 168, 0.1)",
    },
});

// כרטיס מחירים
const PricingCard = styled(Paper)({
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(126, 87, 194, 0.1)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 15px 35px rgba(81, 45, 168, 0.15)",
    },
});

// כרטיס עדויות
const TestimonialCard = styled(Paper)({
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(126, 87, 194, 0.1)",
    position: "relative",
    height: "100%",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(81, 45, 168, 0.1)",
    },
});

// כרטיס "איך זה עובד"
const HowItWorksCard = styled(Box)({
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    padding: "25px",
    borderRadius: "16px",
    transition: "transform 0.3s ease",
    border: "1px solid rgba(126, 87, 194, 0.1)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.03)",
    backgroundColor: "white",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(81, 45, 168, 0.08)",
    },
});

// תג מספר לשלבים
const StepNumber = styled(Box)({
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#7E57C2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
});

// חבילה פופולרית
const PopularBadge = styled(Box)({
    position: "absolute",
    top: "-12px",
    right: "20px",
    backgroundColor: "#FF9800",
    color: "white",
    padding: "5px 15px",
    borderRadius: "100px",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
});

function Home() {
    const navigate = useNavigate();

    return (
        <HomeWrapper>
            <Box sx={{ textAlign: "center", position: "relative" }}>
                <Box sx={{
                    position: "absolute",
                    top: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#7E57C2",
                    opacity: 0.1,
                    fontSize: "120px"
                }}>
                    <BrushIcon sx={{ fontSize: "inherit" }} />
                </Box>
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: "center",
                        mb: 1,
                        fontWeight: "bold",
                        color: "#512da8",
                        fontSize: { xs: "32px", sm: "40px" },
                        position: "relative"
                    }}
                >
                    Welcome to CreativePeak! 🎨
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: "#7E57C2",
                        fontSize: "18px",
                        fontWeight: "500",
                        mb: 2,
                    }}
                >
                    Where designers showcase their inspiration
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3, mb: 5 }}>
                    <FreeButton startIcon={<LoginIcon />} onClick={() => navigate("/logIn")}>
                        Start Free
                    </FreeButton>
                    <StyledButton startIcon={<PersonAddIcon />} onClick={() => navigate("/register")}>
                        Register
                    </StyledButton>
                </Box>
            </Box>

            <Content>
                {/* בסיסי מידע */}
                <InfoSection>
                    <InfoCard>
                        <GradientTitle variant="h4" sx={{ fontWeight: "bold", color: "#512da8", mb: 3 }}>
                            Express Your Creativity
                        </GradientTitle>

                        <Typography variant="h6" sx={{ color: "#444", mb: 3, lineHeight: 1.6 }}>
                            CreativePeak is the ultimate platform for graphic designers who want to showcase their work on a professional, personalized website. Start with our free tier and upgrade as your business grows.
                        </Typography>

                        <Box sx={{ mt: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FeatureCard>
                                        <PaletteIcon sx={{ color: "#7E57C2", fontSize: 28 }} />
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: "600", color: "#333" }}>
                                                Professional Showcase
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Create a stunning portfolio that highlights your skills and style
                                            </Typography>
                                        </Box>
                                    </FeatureCard>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <FeatureCard>
                                        <CreateIcon sx={{ color: "#7E57C2", fontSize: 28 }} />
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: "600", color: "#333" }}>
                                                Easy Management
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Organize your work with categories and project collections
                                            </Typography>
                                        </Box>
                                    </FeatureCard>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <FeatureCard>
                                        <BusinessIcon sx={{ color: "#7E57C2", fontSize: 28 }} />
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: "600", color: "#333" }}>
                                                Business Integration
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Connect your design services with business clients
                                            </Typography>
                                        </Box>
                                    </FeatureCard>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <FeatureCard>
                                        <MonetizationOnIcon sx={{ color: "#7E57C2", fontSize: 28 }} />
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: "600", color: "#333" }}>
                                                Free Access Available
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Start with our free tier and upgrade as your needs grow
                                            </Typography>
                                        </Box>
                                    </FeatureCard>
                                </Grid>
                            </Grid>
                        </Box>
                    </InfoCard>
                </InfoSection>

                {/* סטטיסטיקות */}
                <Box sx={{ mt: 4 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            textAlign: "center", 
                            mb: 5, 
                            fontWeight: "bold", 
                            color: "#512da8"
                        }}
                    >
                        Join Our Growing Community
                    </Typography>
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                            <StatCard>
                                <PeopleIcon sx={{ fontSize: 50, color: "#7E57C2", mb: 2 }} />
                                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#512da8" }}>
                                    12,500+
                                </Typography>
                                <Typography variant="h6" sx={{ color: "#666" }}>
                                    Active Users
                                </Typography>
                            </StatCard>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <StatCard>
                                <BusinessIcon sx={{ fontSize: 50, color: "#7E57C2", mb: 2 }} />
                                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#512da8" }}>
                                    3,200+
                                </Typography>
                                <Typography variant="h6" sx={{ color: "#666" }}>
                                    Business Clients
                                </Typography>
                            </StatCard>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <StatCard>
                                <WorkIcon sx={{ fontSize: 50, color: "#7E57C2", mb: 2 }} />
                                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#512da8" }}>
                                    45,000+
                                </Typography>
                                <Typography variant="h6" sx={{ color: "#666" }}>
                                    Portfolios Created
                                </Typography>
                            </StatCard>
                        </Grid>
                    </Grid>
                </Box>

                {/* איך זה עובד */}
                <Box sx={{ mt: 5 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            textAlign: "center", 
                            mb: 5, 
                            fontWeight: "bold", 
                            color: "#512da8" 
                        }}
                    >
                        <HelpOutlineIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        How It Works
                    </Typography>
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <HowItWorksCard>
                                <StepNumber>1</StepNumber>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#512da8", mb: 1 }}>
                                        Create Your Account
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#666" }}>
                                        Sign up for free and set up your designer profile with basic information about your style and expertise.
                                    </Typography>
                                </Box>
                            </HowItWorksCard>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <HowItWorksCard>
                                <StepNumber>2</StepNumber>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#512da8", mb: 1 }}>
                                        Upload Your Portfolio
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#666" }}>
                                        Add your best work, organize projects into categories, and customize how they display on your profile.
                                    </Typography>
                                </Box>
                            </HowItWorksCard>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <HowItWorksCard>
                                <StepNumber>3</StepNumber>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#512da8", mb: 1 }}>
                                        Grow Your Business
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#666" }}>
                                        Share your professional portfolio with clients, receive inquiries, and expand your creative business.
                                    </Typography>
                                </Box>
                            </HowItWorksCard>
                        </Grid>
                    </Grid>
                </Box>

                {/* מחירון */}
                <Box sx={{ mt: 5 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            textAlign: "center", 
                            mb: 5, 
                            fontWeight: "bold", 
                            color: "#512da8" 
                        }}
                    >
                        <MonetizationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Pricing Plans
                    </Typography>
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <PricingCard>
                                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#512da8", mb: 2, textAlign: "center" }}>
                                    Free
                                </Typography>
                                <Typography variant="h3" sx={{ textAlign: "center", mt: 2, mb: 3 }}>
                                    $0
                                    <Typography component="span" variant="body1" sx={{ color: "#666" }}>/month</Typography>
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Basic portfolio (5 projects)</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">CreativePeak subdomain</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Basic analytics</Typography>
                                    </Box>
                                </Box>
                                <Button 
                                    variant="contained" 
                                    sx={{ 
                                        mt: 3, 
                                        backgroundColor: "#4CAF50", 
                                        "&:hover": { backgroundColor: "#43A047" }
                                    }}
                                    fullWidth
                                    onClick={() => navigate("/login")}
                                >
                                    Start Free
                                </Button>
                            </PricingCard>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <PricingCard sx={{ position: "relative" }}>
                                <PopularBadge>POPULAR</PopularBadge>
                                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#512da8", mb: 2, textAlign: "center" }}>
                                    Pro
                                </Typography>
                                <Typography variant="h3" sx={{ textAlign: "center", mt: 2, mb: 3 }}>
                                    $12
                                    <Typography component="span" variant="body1" sx={{ color: "#666" }}>/month</Typography>
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Unlimited projects</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Custom domain</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Advanced analytics</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Client management tools</Typography>
                                    </Box>
                                </Box>
                                <Button 
                                    variant="contained" 
                                    sx={{ 
                                        mt: 3, 
                                        backgroundColor: "#7E57C2", 
                                        "&:hover": { backgroundColor: "#673AB7" }
                                    }}
                                    fullWidth
                                >
                                    Get Pro
                                </Button>
                            </PricingCard>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <PricingCard>
                                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#512da8", mb: 2, textAlign: "center" }}>
                                    Business
                                </Typography>
                                <Typography variant="h3" sx={{ textAlign: "center", mt: 2, mb: 3 }}>
                                    $29
                                    <Typography component="span" variant="body1" sx={{ color: "#666" }}>/month</Typography>
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Everything in Pro</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Team accounts (up to 5)</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Client portal</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                                        <Typography variant="body2">Priority support</Typography>
                                    </Box>
                                </Box>
                                <Button 
                                    variant="contained" 
                                    sx={{ 
                                        mt: 3, 
                                        backgroundColor: "#512da8", 
                                        "&:hover": { backgroundColor: "#4527A0" }
                                    }}
                                    fullWidth
                                >
                                    Get Business
                                </Button>
                            </PricingCard>
                        </Grid>
                    </Grid>
                </Box>

                {/* עדויות */}
                <Box sx={{ mt: 5 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            textAlign: "center", 
                            mb: 5, 
                            fontWeight: "bold", 
                            color: "#512da8" 
                        }}
                    >
                        <FormatQuoteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        What Designers Say About Us
                    </Typography>
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <TestimonialCard>
                                <Box sx={{ 
                                    color: "#FFC107", 
                                    display: "flex", 
                                    mb: 2,
                                    justifyContent: "center"
                                }}>
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                </Box>
                                <Typography variant="body1" sx={{ mb: 3, fontStyle: "italic", textAlign: "center" }}>
                                    "CreativePeak transformed how I showcase my work. I've received more client inquiries in one month than I did in a year with my old portfolio."
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Avatar sx={{ bgcolor: "#7E57C2", mr: 2 }}>MS</Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>M. S.</Typography>
                                        <Typography variant="caption" sx={{ color: "#666" }}>Logo Designer</Typography>
                                    </Box>
                                </Box>
                            </TestimonialCard>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <TestimonialCard>
                                <Box sx={{ 
                                    color: "#FFC107", 
                                    display: "flex", 
                                    mb: 2,
                                    justifyContent: "center" 
                                }}>
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                </Box>
                                <Typography variant="body1" sx={{ mb: 3, fontStyle: "italic", textAlign: "center" }}>
                                    "The business integration features helped me connect with companies looking for design services. My client base doubled within three months."
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Avatar sx={{ bgcolor: "#512da8", mr: 2 }}>DK</Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>David Klein</Typography>
                                        <Typography variant="caption" sx={{ color: "#666" }}>UI/UX Designer</Typography>
                                    </Box>
                                </Box>
                            </TestimonialCard>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <TestimonialCard>
                                <Box sx={{ 
                                    color: "#FFC107", 
                                    display: "flex", 
                                    mb: 2,
                                    justifyContent: "center" 
                                }}>
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                </Box>
                                <Typography variant="body1" sx={{ mb: 3, fontStyle: "italic", textAlign: "center" }}>
                                    "Started with the free tier and quickly upgraded to Pro. The analytics have been crucial in understanding which designs resonate with my audience."
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Avatar sx={{ bgcolor: "#9C27B0", mr: 2 }}>AJ</Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>A. Johnson</Typography>
                                        <Typography variant="caption" sx={{ color: "#666" }}>Illustrator</Typography>
                                    </Box>
                                </Box>
                            </TestimonialCard>
                        </Grid>
                    </Grid>
                </Box>

                {/* קריאה לפעולה */}
                <Box 
                    sx={{ 
                        mt: 5, 
                        backgroundColor: "rgba(126, 87, 194, 0.05)", 
                        p: 5, 
                        borderRadius: "16px",
                        border: "1px solid rgba(126, 87, 194, 0.1)",
                        textAlign: "center" 
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#512da8" }}>
                        Ready to Showcase Your Creative Work?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, color: "#666" }}>
                        Join thousands of designers who've already elevated their online presence
                    </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3, mb: 5 }}>
                    <FreeButton startIcon={<LoginIcon />} onClick={() => navigate("/logIn")}>
                        Start Free
                    </FreeButton>
                    <StyledButton startIcon={<PersonAddIcon />} onClick={() => navigate("/register")}>
                        Register
                    </StyledButton>
                </Box>
                </Box>

                {/* יתרונות המערכת */}
                <Box sx={{ mt: 5 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            textAlign: "center", 
                            mb: 5, 
                            fontWeight: "bold", 
                            color: "#512da8" 
                        }}
                    >
                        Why Choose CreativePeak?
                    </Typography>
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <InfoCard>
                                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#512da8", mb: 3 }}>
                                    For Designers
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Chip 
                                                label="Portfolio" 
                                                color="primary" 
                                                variant="outlined" 
                                            />
                                            <Typography variant="body1">
                                                Create stunning visual portfolios
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Chip 
                                                label="Visibility" 
                                                color="primary" 
                                                variant="outlined" 
                                            />
                                            <Typography variant="body1">
                                                Increase your online presence
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Chip 
                                                label="Analytics" 
                                                color="primary" 
                                                variant="outlined" 
                                            />
                                            <Typography variant="body1">
                                                Track portfolio performance
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </InfoCard>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <InfoCard>
                                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#512da8", mb: 3 }}>
                                    For Businesses
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Chip 
                                                label="Talent" 
                                                color="primary" 
                                                variant="outlined" 
                                            />
                                            <Typography variant="body1">
                                                Discover talented designers
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Chip 
                                                label="Collaboration" 
                                                color="primary" 
                                                variant="outlined" 
                                            />
                                            <Typography variant="body1">
                                                Streamlined project management
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Chip 
                                                label="Results" 
                                                color="primary" 
                                                variant="outlined" 
                                            />
                                            <Typography variant="body1">
                                                Quality creative deliverables
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </InfoCard>
                        </Grid>
                    </Grid>
                </Box>

                {/* שאלות נפוצות */}
                <Box sx={{ mt: 5 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            textAlign: "center", 
                            mb: 5, 
                            fontWeight: "bold", 
                            color: "#512da8" 
                        }}
                    >
                        Frequently Asked Questions
                    </Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#512da8", mb: 1 }}>
                                    Is there really a free plan?
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666" }}>
                                    Yes! You can start with our free plan that includes basic portfolio features and up to 5 projects. It's perfect for beginners or those who want to try the platform.
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#512da8", mb: 1 }}>
                                    Can I upgrade or downgrade my plan?
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666" }}>
                                    Absolutely! You can upgrade or downgrade your subscription at any time. Your billing will be adjusted accordingly for the next payment period.
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#512da8", mb: 1 }}>
                                    How do clients find me?
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666" }}>
                                    CreativePeak has a designer directory where clients can search for specific design skills. Our Pro and Business plans include SEO optimization to improve your visibility.
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#512da8", mb: 1 }}>
                                    Is my data secure?
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666" }}>
                                    We take security seriously. All your portfolio data is encrypted and stored securely. You retain full rights to all content you upload to the platform.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Content>
            <Typography variant="body2" sx={{ color: "#666", mt: 5, textAlign: "center", fontSize: "14px" }}>
              © CreativePeak Designer System {new Date().getFullYear()} | All rights reserved.
            </Typography>
        </HomeWrapper>
    );
}

export default Home;