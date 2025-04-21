import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';
import AutoSnackbar from '../components/snackbar';

const UploadContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px',
  borderRadius: '12px',
  maxWidth: '500px',
  margin: '0 auto',
});

const StyledButton = styled(Button)<{ component?: React.ElementType }>({
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  borderRadius: '10px',
  padding: '10px 20px',
  transition: '0.3s',
  marginTop: '20px',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const FileInput = styled('input')({
  display: 'none',
});

const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  marginTop: '10px',
  borderRadius: '8px',
});

interface FileUploaderProps {
  existingImageUrl?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ existingImageUrl }) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(existingImageUrl || null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    if (existingImageUrl) {
      setImagePreview(existingImageUrl);
      localStorage.setItem("linkURL", existingImageUrl);
    }
  }, [existingImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setUploaded(false); // מאפשר להעלות קובץ חדש
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const response = await axios.get('https://creativepeak-api.onrender.com/api/S3Images/image-url', {
        params: { fileName: file.name }
      });
      const presignedUrl = response.data.url;

      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);
        },
      });

      const s3BaseUrl = "https://s3.us-east-1.amazonaws.com/creativepeakproject.aws-testpnoren/";
      const imageUrl = `${s3BaseUrl}${encodeURIComponent(file.name)}`;

      localStorage.setItem("linkURL", imageUrl);
      setImagePreview(imageUrl);

      setUploaded(true); // לא לאפשר העלאה חוזרת
      setSnackbarMessage("🎉 File uploaded successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error("❌ Error uploading file:", error);
      setSnackbarMessage("❌ File upload failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fileNameToShow = file
    ? file.name
    : imagePreview
      ? decodeURIComponent(imagePreview.split('/').pop() || '')
      : 'No file selected';

  return (
    <UploadContainer>
      <label htmlFor="file-input">
        <StyledButton variant="contained" color="secondary" component="span" fullWidth>
          Choose a file in .png format only
        </StyledButton>
      </label>

      <FileInput id="file-input" type="file" onChange={handleFileChange} accept="image/*" />

      {!imagePreview && (
        <Typography variant="body1" sx={{ marginTop: '10px', color: '#555' }}>
          {fileNameToShow}
        </Typography>
      )}

      {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}

      {imagePreview && (
        <Typography variant="body1" sx={{ marginTop: '10px', color: '#555' }}>
          {fileNameToShow}
        </Typography>
      )}

      {loading ? (
        <CircularProgress size={40} sx={{ marginTop: '20px',color:"gray" }} />
      ) : (
        <StyledButton
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          disabled={!file || uploaded}
        >
          Upload file
        </StyledButton>
      )}

      {progress > 0 && (
        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          Progress: {progress}%
        </Typography>
      )}

      <AutoSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </UploadContainer>
  );
};

export default FileUploader;
