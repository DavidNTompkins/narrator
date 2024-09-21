import React, { useState, useEffect, useRef } from 'react';
import './Hallucinator.css';

const Hallucinator = ({ messages, genre }) => {
  const [imageData, setImageData] = useState({
    imageUrl: '',
    photographerName: '',
    photographerUrl: '',
  });

  const [transition, setTransition] = useState(false);
  const [showMode, setShowMode] = useState(false);
  const prevMessagesRef = useRef([]);

  const toggleShowMode = () => {
    setShowMode(!showMode);
  };

  useEffect(() => {
    console.log("text change acknowledged");
    const getLastMessage = (currentMessages, prevMessages) => {
      if (currentMessages.length > prevMessages.length) {
        return currentMessages[currentMessages.length - 1];
      } else {
        return null;
      }
    };
    if (showMode && messages && messages.length > 0 && messages !== prevMessagesRef.current) {
      const lastMessage = getLastMessage(messages, prevMessagesRef.current);
      prevMessagesRef.current = messages;
      if (lastMessage) {
        const fetchImageData = async () => {
          try { // the fact that this uses the old testing server makes me pretty sure this is an outdated approach to this
            const response = await fetch('https://narratortestserver2.davidtompkins3.repl.co/hallucinate', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ dialogue: lastMessage,
                                   genre: genre }),
            });

            const data = await response.json();
            console.log(data);
            setImageData({
              imageUrl: data.imageUrl,
              photographerName: data.photographerName,
              photographerUrl: data.photographerProfileURL,
            });

            setTransition(true);
            setTimeout(() => {
              setTransition(false);
            }, 100);
          } catch (error) {
            console.error('Error fetching image data:', error);
          }
        };

        fetchImageData();
      }
    }
  }, [messages, showMode]);

  return (
    <div className="image-component">
      <button onClick={toggleShowMode}>
        {showMode ? 'Stop Hallucinating' : 'Hallucinate'}
      </button>
      {showMode && (
        <div className={`image-container ${transition ? 'blur' : ''}`}>
          <img src={imageData.imageUrl} alt={imageData.photographerName} />
          <p>
            Photo by{' '}
            <a
              href={imageData.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {imageData.photographerName}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Hallucinator;
