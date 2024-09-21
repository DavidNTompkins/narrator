import React, { useEffect, useState } from 'react';
import './UpdatesPopup.css'
import ReactMarkdown from 'react-markdown';

function UpdatesPopup() {
  const [updates, setUpdates] = useState([]);
  const [seenUpdates, setSeenUpdates] = useState(JSON.parse(localStorage.getItem('seenUpdates')) || []);
  const [currentUpdate, setCurrentUpdate] = useState(null);

  useEffect(() => {
  // Fetch updates from the backend
  fetch('https://narratornoncriticalbackend.davidtompkins3.repl.co/updates')
    .then(response => response.json())
    .then(data => {
       const reversedData = data.reverse();
      if (reversedData && reversedData.length > 0 && !seenUpdates.includes(reversedData[0].id)) {
        setCurrentUpdate(reversedData[0]);
        console.log(reversedData[0]);
      }
    })
    .catch(error => console.error('Error fetching updates:', error));
}, []);

  const handleClose = () => {
    setSeenUpdates(prev => [...prev, currentUpdate.id]);
    localStorage.setItem('seenUpdates', JSON.stringify([...seenUpdates, currentUpdate.id]));

    const nextUpdate = updates.find(update => update.id !== currentUpdate.id);
    setCurrentUpdate(nextUpdate);
  };

  return (
    currentUpdate && (
      <div className="updates-popup">
        <div className="updates-popup-content">
          <h2>{currentUpdate.title}</h2>
          <p><ReactMarkdown allowDangerousHtml={true} children={currentUpdate.message.replace(/\\n/g, '\n')} /></p>
          <br></br>
          <p style={{textAlign:'right'}}>{`With love,\nDavid`}</p>
          
          {currentUpdate.imageUrl && <img src={currentUpdate.imageUrl} alt="Update" />}
          <button onClick={handleClose}>Dismiss</button>
        </div>
      </div>
    )
  );
}

export default UpdatesPopup;
