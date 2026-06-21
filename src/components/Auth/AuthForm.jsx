import { useState, useRef } from 'react';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    setError(null); // Clear errors when switching modes
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    setError(null);

    // Replace this with the appropriate API endpoint
    // If using Firebase Authentication, this would be the Identity Toolkit URL
    const url = 'https://react-form-24af0-default-rtdb.firebaseio.com/users.json';

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Displaying the error returned by the server
        throw new Error(data.error?.message || 'Authentication failed!');
      }

      console.log('Success:', data);
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        
        {/* Error Feedback Display */}
        {error && <p className={classes.error}>{error}</p>}

        <div className={classes.actions}>
          {!isLoading && (
            <button type='submit'>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;