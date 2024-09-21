import {React, useState, useEffect} from 'react'

function GameStatus({status,keyboard}) {
  const desktop = (window.innerWidth > 768)
  const waitingString = (desktop ? "Hold Spacebar to Speak" : "Press an image to start speaking, press again to end");
  const listeningString = (desktop ? "Listening...":"Listening... Press an image to finish speaking")
  const [statusString,setStatusString] = useState("Loading...");

  const [opac, setOpac] = useState('')
  useEffect(() => {
      fetch('https://Narratornoncriticalbackend.davidtompkins3.repl.co/message')
  .then(response => response.text())
      .then(data => {
        console.log(data);
    setStatusString(data);
  })
  
}, []); 

  return (
    <div>
      {
        {
          'loading': <p className = "statusText">{statusString}</p>,
          'thinking': <p className = "statusText">Thinking...</p>,
          'speaking': <p className = "statusText">Speaking...</p>,
          'listening': <p className = "statusText">{listeningString}</p>,
          'reading': <p className = "statusText">Enter your message</p>,
          'bad code': <p className = "errorStatusText">Code not recognized. Check URL and try again.</p>,
          'waiting': <p className = "statusText">{waitingString}</p>
        }[status]
      }
    </div>
  );
}


export default GameStatus;