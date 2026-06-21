import { useRef, useContext } from 'react';
import { AuthContext } from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
   const apiKey = 'AIzaSyCONfqWrXYm2ZF4goNOeAzquBy-lidEx8U'; //API KEY
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;

    try {
      const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
          idToken: authCtx.token, // Current user's token
          password: enteredNewPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Could not change password!');
      }

      alert('Password updated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input 
        type='password'
         id='new-password' 
         minLength='7' 
         ref={newPasswordInputRef}
         required />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;