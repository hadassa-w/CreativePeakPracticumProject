import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { styled } from "@mui/system";
import FolderIcon from "@mui/icons-material/Folder";
import CategoryIcon from "@mui/icons-material/Category";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import BrushIcon from '@mui/icons-material/Brush';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { useNavigate } from "react-router-dom";

// קונטיינר כללי - משופר
const WelcomeContainer = styled(Container)({
    backgroundColor: "#fcfaff",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(81, 45, 168, 0.1)",
    padding: "60px 40px",
    maxWidth: "1000px",
    marginTop: "50px",
    marginBottom: "50px",
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

// חלוקת תוכן פנימית - משופרת
const Content = styled(Box)({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: "30px",
    marginTop: "40px",
});

// אזור מידע - משופר
const InfoSection = styled(Box)({
    flex: "1 1 500px",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
});

// אזור כפתורים - משופר
const ActionSection = styled(Box)({
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "25px",
    borderRadius: "16px",
    backgroundColor: "rgba(126, 87, 194, 0.03)",
    border: "1px solid rgba(126, 87, 194, 0.1)",
    padding: "40px 30px",
    position: "relative",
    overflow: "hidden",
});

// כרטיס מידע - משודרג
const InfoCard = styled(Paper)({
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
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

// עטיפת אייקון - חדש
const IconWrapper = styled(Box)({
    backgroundColor: "rgba(126, 87, 194, 0.08)",
    borderRadius: "12px",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "rotate(10deg)",
        backgroundColor: "rgba(126, 87, 194, 0.12)",
    }
});

// כפתור מעוצב - משודרג
const StyledButton = styled(Button)({
    textTransform: "none",
    fontSize: "17px",
    fontWeight: "600",
    borderRadius: "100px",
    padding: "14px 28px",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    border: "2px solid #512da8",
    color: "#512da8",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    maxWidth: "250px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 6px 15px rgba(81, 45, 168, 0.15)",
        backgroundColor: "#512da8",
        color: "white",
        border: "2px solid #512da8",
    },
    "& .MuiSvgIcon-root": {
        fontSize: "22px",
        transition: "transform 0.3s ease",
    },
    "&:hover .MuiSvgIcon-root": {
        transform: "scale(1.2)",
    }
});

// סרגל תחתון עם טיפ
const TipBar = styled(Box)({
    marginTop: "40px",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "rgba(126, 87, 194, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px dashed rgba(126, 87, 194, 0.3)",
});

function Welcome() {
    const navigate = useNavigate();

    return (
        <WelcomeContainer>
            <Box sx={{ textAlign: "center", position: "relative" }}>
                <Box sx={{
                    position: "absolute",
                    top: "-30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#7E57C2",
                    opacity: 0.08,
                    fontSize: "130px"
                }}>
                    <BrushIcon sx={{ fontSize: "inherit" }} />
                </Box>

                <Typography
                    variant="h3"
                    sx={{
                        textAlign: "center",
                        mb: 1.5,
                        fontWeight: "bold",
                        color: "#512da8",
                        fontSize: { xs: "28px", sm: "32px", md: "36px" },
                        position: "relative"
                    }}
                >
                    Welcome to CreativePeak! 🎨
                </Typography>

                <Box sx={{ maxWidth: "700px", mx: "auto" }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#444",
                            mb: 3,
                            fontSize: { xs: "18px", sm: "20px", md: "22px" },
                            lineHeight: 1.5,
                        }}
                    >
                        Create a portfolio and showcase your professional design inspiration!
                    </Typography>
                </Box>
            </Box>

            <Content>
                {/* אזור מידע */}
                <InfoSection>
                    <InfoCard>
                        <IconWrapper>
                            <TipsAndUpdatesIcon fontSize="large" sx={{ color: "#7E57C2" }} />
                        </IconWrapper>

                        <Box>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: "#512da8", mb: 1 }}>
                                Why Build a Portfolio?
                            </Typography>

                            <Typography sx={{ color: "#666", lineHeight: 1.6, fontSize: "16px" }}>
                                A professional portfolio helps you showcase your most impressive and creative work to attract potential clients. Stand out from the crowd with a curated collection of your best designs.
                            </Typography>

                            <Box sx={{
                                mt: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                color: "#7E57C2",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}>
                                <EmojiObjectsIcon sx={{ fontSize: "18px" }} />
                                <Typography variant="body2">
                                    Tip: Update your portfolio regularly with fresh content
                                </Typography>
                            </Box>
                        </Box>
                    </InfoCard>

                    <InfoCard>
                        <IconWrapper>
                            <DesignServicesIcon fontSize="large" sx={{ color: "#7E57C2" }} />
                        </IconWrapper>

                        <Box>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: "#512da8", mb: 1 }}>
                                Showcase Your Style
                            </Typography>

                            <Typography sx={{ color: "#666", lineHeight: 1.6, fontSize: "16px" }}>
                                Upload your best works and let others see your unique talent. Your creativity will inspire interest in your design approach and aesthetic sensibilities.
                            </Typography>

                            <Box sx={{
                                mt: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                color: "#7E57C2",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}>
                                <EmojiObjectsIcon sx={{ fontSize: "18px" }} />
                                <Typography variant="body2">
                                    Tip: Organize your work into meaningful categories
                                </Typography>
                            </Box>
                        </Box>
                    </InfoCard>
                </InfoSection>

                {/* אזור פעולות */}
                <ActionSection>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "600",
                            color: "#512da8",
                            mb: 3,
                            textAlign: "center"
                        }}
                    >
                        Get Started Now
                    </Typography>

                    <StyledButton
                        startIcon={<FolderIcon />}
                        onClick={() => navigate("/projects")}
                        sx={{ mb: 2, fontsize: "15px" }}
                    >
                        Explore Projects
                    </StyledButton>

                    <StyledButton
                        startIcon={<CategoryIcon />}
                        onClick={() => navigate("/categories")}
                        style={{ fontSize: "15px" }}
                    >
                        Manage Categories
                    </StyledButton>

                    <Box sx={{
                        mt: 3,
                        textAlign: "center",
                        color: "#666",
                        fontSize: "15px",
                        p: 2,
                        borderRadius: "8px",
                        backgroundColor: "rgba(126, 87, 194, 0.03)",
                    }}>
                        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                            Organize your work efficiently to make a stronger impression
                        </Typography>
                    </Box>
                </ActionSection>
            </Content>

            <TipBar>
                <EmojiObjectsIcon sx={{ color: "#7E57C2", fontSize: 28 }} />
                <Typography variant="body1" sx={{ color: "#555" }}>
                    <strong>Pro Tip:</strong> Add high-quality images and detailed descriptions to make your portfolio stand out!
                </Typography>
            </TipBar>
            <Typography variant="body2" sx={{ color: "#666", mt: 3, textAlign: "center", fontSize: "14px" }}>
                © All rights reserved.
            </Typography>
        </WelcomeContainer>
    );
}

export default Welcome;