import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const UploadFileComp: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const allowedExtensions = ['.zip', '.rar'];

      // Проверяем расширение файла
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        alert('Please select a ZIP or RAR file.');
        event.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a ZIP or RAR file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/prices/upload', formData);

      if (response.status === 200) {
        alert('File uploaded successfully.');
      } else {
        alert('Error uploading file.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Upload ZIP or RAR File to FTP Server
      </Typography>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".zip,.rar"
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span" fullWidth>
          Choose File
        </Button>
      </label>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {file ? file.name : 'No file chosen'}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ mt: 2 }}
        fullWidth
      >
        Upload
      </Button>
    </Box>
  );
};

export default UploadFileComp;
