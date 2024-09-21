import { useEffect } from 'react';
import { BrowserRouter as Router, Navigate } from 'react-router-dom'; 

const AuthCallback = ({setLoggedIn}) => {
  useEffect(() => {
    setLoggedIn(true);
  }, []);

  return <div>
    Loading...
  <Navigate to="/" />
  </div>;
};

export default AuthCallback