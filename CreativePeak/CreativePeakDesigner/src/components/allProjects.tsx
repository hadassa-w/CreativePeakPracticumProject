import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent } from "@mui/material";
import { styled } from "@mui/system";

const ContentBox = styled(Box)({
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "900px",
    textAlign: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    margin: "auto",
});

interface Image {
    id: number;
    fileName: string;
    description: string;
    linkURL: string;
    categoryId: number;
}

interface Category {
    id: number;
    categoryName: string;
    DesignerDetailsId: number;
}

export default function ImageGallery() {
    const [images, setImages] = useState<Image[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [imagesRes, categoriesRes] = await Promise.all([
                    axios.get("https://creativepeak-api.onrender.com/api/Image"),
                    axios.get("https://creativepeak-api.onrender.com/api/Category"),
                ]);

                setImages(imagesRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "30px" }}>
            <ContentBox>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673AB7", mb: 3 }}>
                    🖼️ All projects
                </Typography>

                {categories.map((category) => {
                    const categoryImages = images.filter((img) => img.categoryId === category.id);

                    if (categoryImages.length === 0) return null; // אם אין תמונות לקטגוריה, לא להציג אותה

                    return (
                        <Box key={category.id} sx={{ mb: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                                {category.categoryName}
                            </Typography>
                            {categoryImages.map((image) => (
                                <Card sx={{ maxWidth: 300, margin: "auto" }}>
                                    <CardMedia component="img" height="200" image={image.linkURL} alt={image.fileName} />
                                    <CardContent>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{image.fileName}</Typography>
                                        <Typography variant="body2" color="text.secondary">{image.description}</Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    );
                })}
            </ContentBox>
        </Box>
    );
}
