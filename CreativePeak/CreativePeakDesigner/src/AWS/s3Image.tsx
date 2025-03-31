import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';

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
  onUploadComplete: (imageUrl: string) => void; // Callback to pass the image URL
}

const FileUploader = ({ onUploadComplete }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      // שלב 1: קבלת Presigned URL מהשרת
      const response = await axios.get('https://creativepeak-api.onrender.com/api/S3Images/image-url', {
        params: { fileName: file.name }
      });
      const presignedUrl = response.data.url;

      // שלב 2: העלאת הקובץ ישירות ל-S3
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percent);
        },
      });

      // Notify parent component with the image URL
      onUploadComplete(presignedUrl); // Pass the URL to parent

      alert('File upload successful!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UploadContainer>
      <label htmlFor="file-input">
        <StyledButton
          variant="contained"
          color="secondary"
          component="span"
          fullWidth
        >
          Choose a file <span style={{fontSize:"10px"}}> in .png format only</span>
        </StyledButton>
      </label>

      <FileInput
        id="file-input"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
      />

      <Typography variant="body1" sx={{ marginTop: '10px', color: '#555' }}>
        {file ? file.name : 'No file selected'}
      </Typography>

      {imagePreview && (
        <ImagePreview src={imagePreview} alt="Preview" />
      )}

      {loading ? (
        <CircularProgress size={40} sx={{ marginTop: '20px' }} />
      ) : (
        <StyledButton
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          disabled={progress === 100 || !file}
        >
          Upload file
        </StyledButton>
      )}

      {progress > 0 && (
        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          Progress: {progress}%
        </Typography>
      )}
    </UploadContainer>
  );
};

export default FileUploader;
