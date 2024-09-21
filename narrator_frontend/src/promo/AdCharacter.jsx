import React, { useState, useEffect, useRef } from "react";
import "../smallScripts/EditableImage.css";

const PromoCharacter = ({mobile}) => {
  const [img_id, set_img] = useState(0);
  const handleCheckout = () => {
    window.location.href = '/plans';
  };
  useEffect(() => {
    const randomInt = Math.floor(Math.random() * 21);
    set_img(randomInt);
  }, []);
  
 
  return (

    <div className="editable-image">
      
           <div
        type="image"
             className="promo-char"
        style={{ width: mobile ? (true ? "40vw" : "") : "" }}
      >
        <div className="image-group promo-char-img-group">
          <ins className="adsbygoogle"
             style={{display:"block"}}
             data-ad-format="fluid"
             data-ad-layout-key="-28+kn+2h-1n-4u"
             data-ad-client="ca-pub-7204332781805355"
             data-ad-slot="6204566251"></ins>
          <p>Ads coming here soon :)</p>
        </div>
        
      </div> 

    </div>

  );
};

export default PromoCharacter;

