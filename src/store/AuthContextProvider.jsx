
import { useState, useEffect, useCallback } from 'react';
import AuthContext from './auth-context';

const API_KEY = 'AIzaSyCONfqWrXYm2ZF4goNOeAzquBy-lidEx8U';

// Helper Function
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjustedExpirationTime = new Date(expirationTime).getTime();

  return adjustedExpirationTime - currentTime;
};

const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
  }, []);

  const loginHandler = (token) => {
    // Token valid for 5 minutes
    const expirationTime = new Date(
      new Date().getTime() + 5 * 60 * 1000
    );

    localStorage.setItem('token', token);
    localStorage.setItem(
      'expirationTime',
      expirationTime.toISOString()
    );

    setToken(token);
  };

  // Validate token when app loads
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedExpirationTime =
        localStorage.getItem('expirationTime');

      if (!storedToken || !storedExpirationTime) {
        return;
      }

      const remainingTime =
        calculateRemainingTime(storedExpirationTime);

      // Token expired
      if (remainingTime <= 0) {
        logoutHandler();
        return;
      }

      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: storedToken,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error?.message || 'Invalid Token'
          );
        }

        setToken(storedToken);
      } catch (error) {
        console.log('Token Invalid:', error.message);
        logoutHandler();
      }
    };

    validateToken();
  }, [logoutHandler]);

  // Auto logout after expiration
  useEffect(() => {
    const expirationTime =
      localStorage.getItem('expirationTime');

    if (!token || !expirationTime) {
      return;
    }

    const remainingTime =
      calculateRemainingTime(expirationTime);

    const timer = setTimeout(() => {
      alert('Session expired. Please login again.');
      logoutHandler();
    }, remainingTime);

    return () => {
      clearTimeout(timer);
    };
  }, [token, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

