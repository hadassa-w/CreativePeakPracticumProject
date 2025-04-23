import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { styled } from "@mui/system";
import FolderIcon from "@mui/icons-material/Folder";
import CategoryIcon from "@mui/icons-material/Category";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { useNavigate } from "react-router-dom";

// קונטיינר כללי
const WelcomeContainer = styled(Container)({
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    padding: "40px",
    maxWidth: "1000px",
    marginTop: "50px",
});

// חלוקת תוכן פנימית
const Content = styled(Box)({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
});

// אזור מידע
const InfoSection = styled(Box)({
    flex: 1,
    minWidth: "280px",
});

// אזור כפתורים
const ActionSection = styled(Box)({
    marginTop: "50px",
    flex: 1,
    minWidth: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
});

// כרטיס מידע
const InfoCard = styled(Paper)({
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    transition: "transform 0.3s ease",
    margin: "20px",
    "&:hover": {
        transform: "scale(1.05)",
    },
});

// כפתור מעוצב
const StyledButton = styled(Button)({
    textTransform: "none",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "100px",
    padding: "10px 20px",
    transition: "0.3s",
    backgroundColor: "white", // צבע סגלגל
    border: "2px solid #512da8", // צבע סגלגל
    color: "#512da8",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    "&:hover": {
        transform: "scale(1.05)",
        border: "2px solid #7E57C2", // צבע סגלגל
        color: "#7E57C2",
    },
});

function Welcome() {
    const navigate = useNavigate();

    return (
        <WelcomeContainer>
            <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: "bold", color: "#512da8", fontSize: "30px" }}>
                Welcome to CreativePeak site! 🎨
            </Typography>

            <Typography variant="h5" sx={{ color: "#444", mb: 3, fontSize: "25px" }}>
                Create a portfolio and showcase your professional design inspiration!            </Typography>

            <Content>
                {/* אזור מידע */}
                <InfoSection>
                    <InfoCard>
                        <TipsAndUpdatesIcon fontSize="large" sx={{ color: "#7E57C2" }} />
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Why Build a Portfolio?</Typography>
                            <Typography color="textSecondary">
                                A professional portfolio helps you showcase your most professional and creative work and attract clients.                </Typography>
                        </Box>
                    </InfoCard>

                    <InfoCard>
                        <DesignServicesIcon fontSize="large" sx={{ color: "#7E57C2" }} />
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Showcase Your Style</Typography>
                            <Typography color="textSecondary">

                                Upload your best works, let others see your unique talent and it will inspire and interest in your creativity!
                            </Typography>
                        </Box>
                    </InfoCard>
                </InfoSection>

                {/* אזור פעולות */}
                <ActionSection>
                    <StyledButton
                        startIcon={<FolderIcon />}
                        onClick={() => navigate("/projects")}
                    >
                        Go to Projects
                    </StyledButton>

                    <StyledButton
                        startIcon={<CategoryIcon />}
                        onClick={() => navigate("/categories")}
                    >
                        Manage Categories
                    </StyledButton>
                </ActionSection>
            </Content>
        </WelcomeContainer>
        // </PageWrapper>
    );
}

export default Welcome;
