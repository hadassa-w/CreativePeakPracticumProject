import { Box, Typography, Container, Button } from "@mui/material";
import { styled } from "@mui/system";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import {  } from "../css/welcome.css";

// Styled button design
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

// Content box with a semi-transparent background for better readability
const ContentBox = styled(Container)({
    backgroundColor: "rgba(255, 255, 255, 0.8)", // White with transparency
    borderRadius: "10px",
    padding: "40px",
    maxWidth: "600px",
});

function Welcome() {
    return (
        // <BackgroundWrapper>
            <ContentBox>
                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                    🎨 Welcome!
                </Typography>

                <Typography variant="h5" sx={{ color: "#444", mb: 3,fontSize:25 }}>
                    Create your own portfolio and showcase your designs!
                </Typography>

                <Typography variant="body1" sx={{ color: "#555", mb: 4,fontSize:18}}>
                A professional portfolio helps youattract clients, and share your creativity.  
                    Upload your best work, describe your design process, and let see your unique talent!
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                    <StyledButton variant="contained" color="secondary" startIcon={<AddPhotoAlternateIcon />} onClick={() => alert("Create a new project")}>
                        Add Project
                    </StyledButton>

                    <StyledButton variant="outlined" color="secondary" startIcon={<FolderOpenIcon />} onClick={() => alert("View portfolio")}>
                        View Portfolio
                    </StyledButton>
                </Box>
            </ContentBox>
        // </BackgroundWrapper>
    );
}

export default Welcome;
