import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:4000/upload', formData, { // Updated port here
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      });

      setFileURL(res.data.filePath);
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-form">
      <input type="file" onChange={handleChange} />
      <div className="upload-button-container">
        <button type="button" onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {uploadProgress > 0 && <p>Progress: {uploadProgress}%</p>}
      {error && <p className="error">{error}</p>}
      {fileURL && (
        <div className="file-url">
          <p>File URL:</p>
          <a href={fileURL} target="_blank" rel="noopener noreferrer">
            {fileURL}
          </a>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
