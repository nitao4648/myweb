// src/components/ModelUpload.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Signout } from './Login';  // assuming you exported it there (or adjust path)
import ProgressBar from './ProgressBar';
import { uploadModel } from '../api';

function ModelUpload({ setUser }) {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [compressedModel, setCompressedModel] = useState(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await SignOut(setUser, navigate);
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('description', description);
    formData.append('model', file);

    try {
      const response = await uploadModel(formData, (event) => {
        if (event.lengthComputable) {
          setProgress((event.loaded / event.total) * 100);
        }
      });
      setCompressedModel(response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <h2>Upload / Compression Page</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe your model"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept=".zip,.tar,.h5,.pt,.onnx"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload & Compress</button>
      </form>

      {progress > 0 && <ProgressBar progress={progress} />}
      {compressedModel && (
        <a href={compressedModel.url} download>
          Download Compressed Model
        </a>
      )}

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
}

export default ModelUpload;
