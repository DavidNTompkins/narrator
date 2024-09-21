import React, { useState, useEffect, useRef } from 'react';
import {HiLink} from 'react-icons/hi'
//import './LinkButton.css';

const LinkButton = ({ id }) => {
  const [showLink, setShowLink] = useState(false);
  const ref = useRef(null);
  const link = `https://playnarrator.com/adventure/${id}/public`


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowLink(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleButtonClick = () => {
    setShowLink(true);
  };

  return (
    <div ref={ref}>
      <button className="link-button" onClick={handleButtonClick}> <HiLink /> </button>
      {showLink && <div className="link-popup"><a style={{color:'#b4ecee',maxWidth:'90%', fontSize:'0.8em'}} href={link}>{link}</a></div>}
    </div>
  );
}

export default LinkButton;
