import { useState } from "react"
import AuthContext from "./auth-context";

const initialToken = localStorage.getItem('token');

const AuthContextProvider = (props) => {
    const [token, setToken] = useState(initialToken);

    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
    };

    const logoutHandler = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

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