import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { styled } from "@mui/system";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

// עטיפת הדף
const HomeWrapper = styled(Container)({
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    padding: "50px",
    maxWidth: "800px",
    marginTop: "60px",
});

// כרטיס תוכן
const InfoCard = styled(Paper)({
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginBottom: "30px",
    alignItems: "center",
    gap: "15px",
    transition: "transform 0.3s ease",
    margin: "50px",
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

function Home() {
    const navigate = useNavigate();

    return (
        <HomeWrapper>
            <Typography variant="h3" sx={{ textAlign: "center", mb: 4, fontWeight: "bold", color: "#512da8", fontSize: "40px" }}>
                Welcome to CreativePeak! 🎨
            </Typography>

            <InfoCard>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 2 }}>
                    Hello!
                </Typography>

                <Typography variant="h5" sx={{ color: "#444", mb: 2 }}>
                    This is a site for graphic designers who want to upload their portfolio to a personal website.
                </Typography>

                <Typography variant="body1" sx={{ color: "#555", fontSize: 18 }}>
                    Interested? Join us!
                </Typography>
            </InfoCard>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
                <StyledButton startIcon={<LoginIcon />} onClick={() => navigate("/logIn")}>
                    Log In
                </StyledButton>

                <StyledButton startIcon={<PersonAddIcon />} onClick={() => navigate("/register")}>
                    New? Register
                </StyledButton>
            </Box>
        </HomeWrapper>
    );
}

export default Home;
