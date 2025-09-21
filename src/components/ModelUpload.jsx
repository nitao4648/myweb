// src/components/ModelUpload.js
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import { uploadModel } from '../api';

const ModelUpload = () => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [compressedModel, setCompressedModel] = useState(null);

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
    <form onSubmit={handleSubmit}>
      <textarea placeholder="Describe your model" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="file" accept=".zip,.tar,.h5,.pt,.onnx" onChange={handleFileChange} required />
      <button type="submit">Upload & Compress</button>
      {progress > 0 && <ProgressBar progress={progress} />}
      {compressedModel && <a href={compressedModel.url} download>Download Compressed Model</a>}
    </form>
  );
};

export default ModelUpload;

