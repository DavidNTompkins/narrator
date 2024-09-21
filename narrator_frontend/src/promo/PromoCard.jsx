import React, { useState, useEffect } from 'react';
//import NsfwToggleButton from '../subpages/explorePageitems/NSFWToggle.jsx';

const PromoCard = () => {
  const [imgId, setImgId] = useState(Math.floor(Math.random() * 21));
  const [isHovering, setIsHovering] = useState(false);
   const [buttonText, setButtonText] = useState('Join Discord?');

  const handleCheckout = () => {
    window.location.href = 'https://twitter.com/davidntompkins';
  };
  const goDiscord = () => {
    window.location.href = 'https://discord.gg/KhRHNerQjj';
  };
  const handleShare = () => {
    navigator.clipboard.writeText("https://playnarrator.com/")
      .then(() => {
        setButtonText('Copied to clipboard!'); // Change the button text
        setTimeout(() => setButtonText('Share link'), 3000); // Revert back after 3 seconds
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  useEffect(() => {
    setImgId(Math.floor(Math.random() * 21)); // Set the image ID when the component mounts
  }, []);

  const imgSrc = isHovering 
    ? `/image_assets/promo_chars/farewell.webp` 
    : `/image_assets/promo_chars/farewell.png`;

  return (
    <div className="gold-card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}>
      <div className="card-images">
        <div 
          className="character-image-container" 
          style={{ margin: 'auto' }}
        >
          <img src={imgSrc} alt="Gold Tier" style={{ width: '14em', maxWidth: '2000px', height: 'auto' }} />
        </div>
      </div>

      <div className="card-info">
        <h3 style={{ marginBottom: 0 }}>Narrator is open source!</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin:0 }}>
            <button 
              style={{ marginTop: 0, border: '1px solid gold', display: 'inline-block' }} 
              onClick={goDiscord} 
              className="card-button"
            >
              {buttonText}
            </button>
            <button 
              style={{ marginTop: 0, border: '1px solid gold', display: 'inline-block' }} 
              onClick={handleCheckout} 
              className="card-button"
            >
              Follow me on X?
            </button>
        </div>

        <div>
          <p style={{ display: 'inline' }}>Have questions? Ask on Discord! Want to see what else I'm cooking? Join me on X</p>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;
