import { useContext } from "react";
import { Link, useHistory } from 'react-router-dom';
import classes from './MainNavigation.module.css';
import AuthContext from "../../store/auth-context";

const MainNavigation = () => {
    const authCtx  = useContext(AuthContext);
    const history = useHistory();//Hook for redirection

    const logoutHandler = () => {
      authCtx.logout();//Set the local storage to null (and clear localStorage)
      history.replace('/auth');//Redirect the user to the login page
    };
    const isLoggedIn = authCtx.isLoggedIn;
    
  return (
    <header className={classes.header}>
      <Link to="/">
 <div className={classes.logo}>React Auth</div>
      </Link>
    <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;