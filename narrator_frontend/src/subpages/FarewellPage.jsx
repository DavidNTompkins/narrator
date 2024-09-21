import React from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FarewellPage.css'; // You'll need to create this CSS file
import logoImage from '../img/logo.png';
import farewellImage from '../img/farewell.png'; // Add your farewell image
import { FaTwitter, FaGlobe } from 'react-icons/fa';

const FarewellPage = ({ user, setUser }) => {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = React.useState('#242631');

  React.useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  return (
    <>
      <ToastContainer />
      <div className="farewell-container">
        <header>
          <a className="logo-div" href="/">
            <img className="logo" src={logoImage} alt="Logo" />
          </a>
        </header>

        <div className="farewell-content">
          <h1>That's all folks!</h1>
          <img src={farewellImage} alt="Farewell" className="farewell-image" />
          <p className="farewell-message">
            Thanks for playing! It means a lot to me that you all played this game! We're shutting down and are taking no new subscriptions. Any existing subscriptions have been cancelled and you won't be charged again. If you have any questions or need help, email me at david@playnarrator.com. 
          </p>
          <p className="farewell-message">
            I'm not sure what comes next, but if you'd like to keep in touch, I'm on twitter, or you could just stay in the playnarrator discord. I'll ping that the next time I make something. Thanks again! 
          </p>
          <div className="farewell-buttons">
            <a href="https://twitter.com/davidntompkins" className="farewell-button startButton">
              <FaTwitter /> Follow me on X
            </a>
            <a href="https://discord.gg/KhRHNerQjj" className="farewell-button startButton">
              Join the discord
            </a>
          </div>
        </div>
      </div>

      <div className="MainLinks">
        <a href="/terms">Terms</a>
        <a href="/FAQ">FAQ</a>
        <a href="/privacy">Privacy</a>
      </div>
    </>
  );
};

export default FarewellPage;