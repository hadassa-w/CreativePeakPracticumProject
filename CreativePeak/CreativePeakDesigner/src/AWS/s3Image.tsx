import React, { useState, useRef } from 'react';
import {
  Button,
  Typography,
  Container,
  Box,
  styled
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const UploadContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px',
  borderRadius: '12px',
  maxWidth: '500px',
  margin: '0 auto',
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  fontSize: '15px',
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
  onFileChange: (file: File | null) => void;
  onPreviewChange: (preview: string | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  existingImageUrl,
  onFileChange,
  onPreviewChange
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(existingImageUrl || null);
  const [fileName, setFileName] = useState<string>(
    existingImageUrl ? decodeURIComponent(existingImageUrl.split('/').pop() || '') : 'No file selected'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFileName(selectedFile.name);

      // Pass the file to parent component
      onFileChange(selectedFile);

      // Create and set preview
      const preview = URL.createObjectURL(selectedFile);
      setImagePreview(preview);
      onPreviewChange(preview);
    }
  };

  const handleButtonClick = () => {
    // Programmatically click the hidden input when button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <UploadContainer>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <StyledButton
          {...({
            component: 'span',
            variant: 'contained',
            color: 'secondary',
            fullWidth: true,
            startIcon: <PhotoCamera />,
            onClick: handleButtonClick,
            children: 'Choose an image (.png, .jpg or .jpeg)',
          } as any)}
        />

        <FileInput
          ref={fileInputRef}
          id="file-input"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />
      </Box>

      {imagePreview && (
        <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
          <ImagePreview src={imagePreview} alt="Preview" />
          <Typography variant="body1" sx={{ marginTop: '10px', color: '#555' }}>
            {fileName}
          </Typography>
        </Box>
      )}
    </UploadContainer>
  );
};

export default FileUploader;