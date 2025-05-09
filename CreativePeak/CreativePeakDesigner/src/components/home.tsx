import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { styled } from "@mui/system";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaletteIcon from "@mui/icons-material/Palette";
import CreateIcon from "@mui/icons-material/Create";
import BrushIcon from "@mui/icons-material/Brush";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

// עטיפת הדף - משופרת עם צבע רקע מעודן
const HomeWrapper = styled(Container)({
    backgroundColor: "#fcfaff", // רקע בהיר עם גוון סגול עדין
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(81, 45, 168, 0.1)",
    padding: "60px 40px",
    maxWidth: "1000px",
    marginBottom: "60px",
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
    marginTop: "30px",
});

// אזור מידע
const InfoSection = styled(Box)({
    flex: "1 1 500px",
});

// אזור כפתורים
const ActionSection = styled(Box)({
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "30px",
    borderRadius: "16px",
    backgroundColor: "rgba(126, 87, 194, 0.03)",
    border: "1px solid rgba(126, 87, 194, 0.1)",
});

// כרטיס מידע - משודרג
const InfoCard = styled(Paper)({
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05)",
    marginBottom: "25px",
    transition: "all 0.3s ease",
    border: "1px solid rgba(126, 87, 194, 0.1)",
    position: "relative",
    overflow: "hidden",
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
                        mb: 5,
                    }}
                >
                    Where designers showcase their inspiration
                </Typography>
            </Box>

            <Content>
                <InfoSection>
                    <InfoCard>
                        <GradientTitle variant="h4" sx={{ fontWeight: "bold", color: "#512da8", mb: 3 }}>
                            Express Your Creativity
                        </GradientTitle>

                        <Typography variant="h6" sx={{ color: "#444", mb: 3, lineHeight: 1.6 }}>
                            This is a platform for graphic designers who want to showcase their portfolio on a personal, professional website.
                        </Typography>

                        <Box sx={{ mt: 4 }}>
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
                        </Box>
                    </InfoCard>
                </InfoSection>

                <ActionSection>
                    <Typography variant="h6" sx={{ color: "#512da8", mb: 3, fontWeight: "600", textAlign: "center" }}>
                        Ready to get started?
                    </Typography>

                    <StyledButton startIcon={<LoginIcon />} onClick={() => navigate("/logIn")}>
                        Log In
                    </StyledButton>

                    <Typography variant="body2" sx={{ color: "#666", my: 1, textAlign: "center" }}>
                        or
                    </Typography>

                    <StyledButton startIcon={<PersonAddIcon />} onClick={() => navigate("/register")}>
                        Register
                    </StyledButton>

                    <Typography variant="body2" sx={{ color: "#666", mt: 3, textAlign: "center", fontSize: "14px" }}>
                        Join our creative community today!
                    </Typography>
                </ActionSection>
            </Content>
            <Typography variant="body2" sx={{ color: "#666", mt: 3, textAlign: "center", fontSize: "14px" }}>
                © All rights reserved.
            </Typography>
        </HomeWrapper>
    );
}

export default Home;