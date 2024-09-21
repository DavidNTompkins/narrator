import React, { useEffect, useState } from 'react';
import { useHallucination } from './HallucinationContext';
import './hallucinator.css';

const Hallucinator = ({ darkMode, mobile, downgraded }) => {
  const { images, hallucinationOn,setHallucinationOnStateOnly } = useHallucination();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [userNavigatedBack, setUserNavigatedBack] = useState(false);
  const [lastImageChangeTime, setLastImageChangeTime] = useState(Date.now());
  const [randomInt,setRandomInt] = useState(0)

  // Function to move to the next image
  const moveToNextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setLastImageChangeTime(Date.now());
      setUserNavigatedBack(false);
    }
  };
  useEffect(() =>{setRandomInt(Math.floor(Math.random() * 5))},[])
  // Function to move to the previous image
  const moveToPrevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      setUserNavigatedBack(true);
    }
  };
  useEffect(()=>{
    if(downgraded && hallucinationOn){
      setHallucinationOnStateOnly(false);
    }
  },[downgraded])

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    if (currentIndex < images.length - 1 && !userNavigatedBack) {
      const timeSinceLastChange = Date.now() - lastImageChangeTime;
      const delay = Math.max(0, 500 - timeSinceLastChange);

      const newTimerId = setTimeout(moveToNextImage, delay);
      setTimerId(newTimerId);
    }

    return () => clearTimeout(timerId);
  }, [currentIndex, images.length, userNavigatedBack]);

  return (
    <>
      {hallucinationOn &&
        <div className="hallucinator" style={{
          backgroundColor: darkMode ? '#2b2e3b' : '#ffffff',
          height: hallucinationOn ?
            mobile ? '35vh' : '30vh'
            : '0vh'
        }}>
          
            <>
              <button onClick={moveToPrevImage} className="left-button">{'<'}</button>
              <img className={`hallucination fade-in`} src={images[currentIndex] || `/image_assets/hallucinatorAssets/hallucination${randomInt}.png`} alt="Slideshow" />
              {currentIndex !== images.length - 1 && <button onClick={moveToNextImage} className="right-button">{'>'}</button>}
            </>
          
        </div>
      }
    </>
  );
};

export default Hallucinator;
