import React, { useState, useEffect } from "react";
import "../smallScripts/EditableImage.css";

const PromoCharacter = ({ mobile }) => {
  const [imgId, setImgId] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleCheckout = () => {
    window.location.href = '/plans';
  };

  useEffect(() => {
    const randomInt = Math.floor(Math.random() * 21);
    setImgId(randomInt);
  }, []);

  const imgSrc = isHovering 
    ? `/image_assets/promo_chars/promo${imgId}.webp` 
    : `/image_assets/promo_chars/promo${imgId}.png`;

  return (
    <div className="editable-image">
      <div
        className="promo-char"
        type="image"
        style={{ width: mobile ? (true ? "40vw" : "") : "" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="image-group promo-char-img-group">
          <img src={imgSrc} style={{ WebkitTouchCallout: "none" }} alt={'SignUp'} />
        </div>
        {!mobile && <h4 style={{ marginBottom: 0 }}>{'Ready for more?'}</h4>}
        <button 
          style={{ marginTop: mobile ? '0' : '-0.6em', border: '1px solid gold', marginBottom: 0 }} 
          onClick={handleCheckout} 
          className="card-button"
        >
          Join Today
        </button>
        {!mobile && <h4>{'Sign up to unlock full access'}</h4>}
      </div> 
    </div>
  );
};

export default PromoCharacter;
