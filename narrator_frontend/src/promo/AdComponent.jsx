import React, { useEffect } from 'react';

const AdComponent = ({ adSlot, type, adFormat = 'auto' }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <>
      <div className="ad-card">
    {type=="homepage" ? 
    <ins className="adsbygoogle"
         style={{ display: 'block' }}
         data-ad-client="ca-pub-7204332781805355"
         data-ad-slot={adSlot}
         data-ad-format={adFormat}
      data-full-width-responsive="true"
      ></ins>
      :    
    <ins className="adsbygoogle"
       style={{display:"block"}}
       data-ad-format="fluid"
       data-ad-layout-key="-28+kn+2h-1n-4u"
       data-ad-client="ca-pub-7204332781805355"
       data-ad-slot="6204566251"></ins>
         }
        <div className="card-info">
          <h3 style={{ marginBottom: 0 }}>This is an ad</h3>
          </div>
        </div>
      </>
  );
};

export default AdComponent;
