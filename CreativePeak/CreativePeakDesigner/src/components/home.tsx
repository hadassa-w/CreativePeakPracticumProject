import { Box, Typography, Container, Button } from "@mui/material";
import { styled } from "@mui/system";
import LoginIcon from "@mui/icons-material/Login"; // אייקון כניסה
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // אייקון הרשמה
import { useNavigate } from "react-router-dom"; // ✅ ייבוא הפונקציה לניווט

// עיצוב כפתור
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

// קופסה מעוצבת
const ContentBox = styled(Container)({
    backgroundColor: "rgba(255, 255, 255, 0.8)", // רקע חצי-שקוף
    borderRadius: "10px",
    padding: "40px",
    maxWidth: "600px",
});

function Home() {
    const navigate = useNavigate(); // ✅ יצירת פונקציה לניווט

    return (
        <ContentBox>
            {/* כותרת ראשית */}
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                Hello!
            </Typography>

            {/* תיאור קצר */}
            <Typography variant="h5" sx={{ color: "#444", mb: 3, fontSize: 25 }}>
                This is a site for graphic designers who want to upload their portfolio to a personal website.
            </Typography>

            {/* טקסט נוסף */}
            <Typography variant="body1" sx={{ color: "#555", mb: 4, fontSize: 18 }}>
                Interested?
            </Typography>

            {/* כפתורים */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                <StyledButton
                    variant="contained"
                    color="secondary"
                    startIcon={<LoginIcon />}
                    onClick={() => navigate("/logIn")} // ✅ ניווט לדף ההתחברות
                >
                    Log In
                </StyledButton>

                <StyledButton
                    variant="outlined"
                    color="secondary"
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate("/register")} // ✅ ניווט לדף ההרשמה
                >
                    New? Register
                </StyledButton>
            </Box>
        </ContentBox>
    );
}

export default Home;
