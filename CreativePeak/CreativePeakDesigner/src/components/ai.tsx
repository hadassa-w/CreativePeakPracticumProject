const EDEN_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDA5NTJkZjUtYzhjYy00ZTI4LWFmNDgtYTgwNDNjYzE5YjJjIiwidHlwZSI6ImFwaV90b2tlbiJ9.wMy040P-VMfnkhi5bd0QQ6ngFAkJRmLfskuMn5EPddY"; 

export const checkImageQualityAI = async (imageUrl: string): Promise<string | null> => {
  try {
    const response = await fetch("https://api.edenai.run/v2/image/quality_detection", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${EDEN_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        providers: "google,amazon", // נותנים כמה ספקים לחישוב ממוצע
        file_url: imageUrl,
        fallback_providers: ""
      })
    });

    const data = await response.json();

    // אפשר לבדוק לפי ממוצע של ספקים
    const googleScore = data.google?.quality?.score ?? 0;
    const amazonScore = data.amazon?.quality?.score ?? 0;

    const averageScore = (googleScore + amazonScore) / 2;

    console.log("Image quality score:", averageScore);

    if (averageScore < 0.5) {
      return "📸 The image quality is too low. Please upload a clearer photo.";
    } else {
      return null; // איכות בסדר
    }
  } catch (error) {
    console.error("Error checking image quality:", error);
    return "❌ Failed to check image quality.";
  }
};
