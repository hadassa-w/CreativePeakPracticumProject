import { Box, Typography, Container, Button } from "@mui/material";
import { styled } from "@mui/system";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useNavigate } from "react-router-dom"; // 👈 ייבוא הפונקציה לניווט

// עיצוב הכפתור
const StyledButton = styled(Button)({
    textTransform: "none",
    fontSize: "15px",
    fontWeight: "bold",
    borderRadius: "10px",
    padding: "10px 20px",
    transition: "0.3s",
    "&:hover": {
        transform: "scale(1.05)",
    },
});

// עיצוב הרקע של התוכן
const ContentBox = styled(Container)({
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "10px",
    padding: "40px",
    maxWidth: "600px",
});

function Welcome() {
    const navigate = useNavigate(); // 👈 יצירת פונקציית הניווט

    return (
        <ContentBox>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                🎨 Welcome!
            </Typography>

            <Typography variant="h5" sx={{ color: "#444", mb: 3, fontSize: 25 }}>
                Create your own portfolio and showcase your designs!
            </Typography>

            <Typography variant="body1" sx={{ color: "#555", mb: 4, fontSize: 18 }}>
                A professional portfolio helps you attract clients and share your creativity.
                Upload your best work, describe your design process, and let others see your unique talent!
            </Typography>

            {/* כפתורים לניווט בין עמודים */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                <StyledButton
                    variant="outlined"
                    color="secondary"
                    startIcon={<FolderOpenIcon />}
                    onClick={() => navigate("/allProjects")} // 👈 ניווט לעמוד "View Portfolio"
                >
                    All projects
                </StyledButton>
                <StyledButton
                    variant="contained"
                    color="secondary"
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={() => navigate("/allCategory")} // 👈 ניווט לעמוד "Add Project"
                >
                    All categories
                </StyledButton>
            </Box>
        </ContentBox>
    );
}

export default Welcome;
