// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import { Auth } from '@aws-amplify/auth';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await Auth.signIn(email, password);
      // You can also get tokens if needed:
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      const accessToken = session.getAccessToken().getJwtToken();

    // Replace with actual authentication logic
    
    setUser(user);
    navigate('/upload');
  }catch (err) {
      console.error('Login error:', err);
      if (err.code === 'UserNotConfirmedException') {
        setError('User not confirmed. Please check your email for confirmation link.');
      } else if (err.code === 'NotAuthorizedException') {
        setError('Incorrect username or password.');
      } else if (err.code === 'UserNotFoundException') {
        setError('User does not exist.');
      } else {
        setError('Error signing in: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;

