// src/components/Login.jsx
import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import awsExports from '../aws-exports';
import { fetchAuthSession } from 'aws-amplify/auth';

function SomeComponent() {
  useEffect(() => {
    async function checkSession() {
      try {
        const session = await fetchAuthSession();
        // ...
      } catch(e) {
        console.log(e);
      }
    }
    checkSession();
  }, []);

  // ...
}

Amplify.configure({ ...awsExports });

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
      // Using v6 signIn
      const signInResult = await signIn({  
        username: email,
        password,
        // options if needed
      });
      // signInResult contains info like whether signIn completed etc.
      // You may want to call fetchAuthSession to get tokens / user info
      const session = await fetchAuthSession();
      // session.tokens.idToken etc if you need them

      setUser(signInResult); // or use session
      navigate('/upload');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Error signing in');
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
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
