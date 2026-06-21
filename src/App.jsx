import { Switch, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { useContext } from 'react';
import AuthContext from './store/auth-context';

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>

      {!authCtx.isLoggedIn && (
        <Route path="/auth">
          <AuthPage />
        </Route>
     )}

       {authCtx.isLoggedIn && (
        <Route path="/profile">
          <ProfilePage />
        </Route>
        )}
        
      </Switch>
    </Layout>
  );
}

export default App;