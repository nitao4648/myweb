// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from './components/Login';
import ModelUpload from './components/ModelUpload';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={user ? <ModelUpload /> : <Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
};

export default App;

