// src/api.js
import axios from 'axios';

export const uploadModel = (formData, onUploadProgress) => {
  return axios.post('YOUR_BACKEND_URL/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

