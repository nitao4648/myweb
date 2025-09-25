// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signIn, signOut } from 'aws-amplify/auth';
import { useNavigate, Link } from 'react-router-dom';
import awsExports from '../aws-exports';
import { signUp, confirmSignUp } from 'aws-amplify/auth';

Amplify.configure({ ...awsExports });

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('signup'); // or 'confirm'
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          }
        }
      });
      console.log("signUp result:", isSignUpComplete, nextStep);
      setStep('confirm');
    } catch (err) {
      setError(err.message || 'Error signing up');
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: verificationCode
      });
      if (isSignUpComplete) {
        // registration confirmed
      }
    } catch (err) {
      setError(err.message || 'Error confirming signup');
    }
  };

  return (
    <div>
      {step === 'signup' && (
        <form onSubmit={handleSignUp}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Sign Up</button>
          {error && <p style={{color:'red'}}>{error}</p>}
        </form>
      )}
      {step === 'confirm' && (
        <form onSubmit={handleConfirm}>
          <input type="text" value={verificationCode} onChange={e=>setVerificationCode(e.target.value)} placeholder="Code" required />
          <button type="submit">Confirm Sign Up</button>
          {error && <p style={{color:'red'}}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export function Login({ setUser }) {
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
      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
export function Signout({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    // Clear user state
    if (typeof setUser === 'function') {
      setUser(null);
    }
    // Redirect to login (or home)
    if (typeof navigate === 'function') {
      navigate('/');
    }
  } catch (err) {
    console.error('Error signing out:', err);
  }
}
}

export default Login;
