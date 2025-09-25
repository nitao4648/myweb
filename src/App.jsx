// src/App.js
console.log("App.jsx is rendering");

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register, Signout } from './components/Login';
import ModelUpload from './components/ModelUpload';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/upload"
        element={user ? <ModelUpload /> : <Login setUser={setUser} />}
      />
      <Route path="*" element={<div>404: Page Not Found</div>} />
    </Routes>
  );
};

export default App;