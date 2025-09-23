// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signIn } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import awsExports from '../aws-exports';

Amplify.configure({ ...awsExports });

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingSession, setLoadingSession] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await fetchAuthSession();
        console.log("fetchAuthSession result:", session);
        if (session?.tokens?.accessToken) {
          // user is signed in
          setSessionInfo(session);
          setUser(session);  // or use more precise user object
          navigate('/upload');
          return;
        }
      } catch (err) {
        console.log("Error in fetchAuthSession:", err);
        // maybe user not signed in; that's ok
      } finally {
        setLoadingSession(false);
      }
    }
    checkSession();
  }, [navigate, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const result = await signIn({ username: email, password });
      console.log("SignIn result:", result);
      // after sign in, you may want to call fetchAuthSession again, or just navigate
      const session = await fetchAuthSession();
      setUser(session);
      navigate('/upload');
    } catch (err) {
      console.error("Sign in error:", err);
      setErrorMessage(err.message ?? 'Sign in failed');
    }
  };

  if (loadingSession) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
        <button type="submit">Login</button>
      </form>
      {sessionInfo && <div>Signed in as: {sessionInfo.tokens?.idToken?.payload?.email || 'Unknown user'}</div>}
    </div>
  );
}

export default Login;
