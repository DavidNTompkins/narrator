import React, { useState, useEffect} from 'react';
import './ImageTransition.css';
import logoImage from '../img/logo.png'
import logoImageDark from '../img/logoDark.png'

const ImageTransition = ({ image1=logoImage, image2=logoImageDark, duration = 2500 }) => {
   const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className="logo">
      <img src={logoImage} alt="" className='logo'} />
      <img src={logoImageDark} alt="" className='logo2'} />
    </div>
  );
};

export default ImageTransition;
//BROKEN!