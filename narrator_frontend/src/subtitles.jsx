import React, { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import TextareaAutosize from 'react-textarea-autosize';
import hyperionSummary from './hyperion.jsx';
import { FaPaperPlane, FaDice } from 'react-icons/fa';

import generatePrimaryPrompt from './smallScripts/PromptGenerator.js';
import FontSizeToggle from './smallScripts/subtitle_buttons/FontSizeToggle';
import DarkModeToggle from './smallScripts/subtitle_buttons/DarkModeToggle';
import RewindButton from './smallScripts/subtitle_buttons/RewindButton.jsx';
import StopStreamingButton from './smallScripts/subtitle_buttons/StopStreamingButton';
import Hallucinator from './hallucinator/Hallucinator.jsx';
import HallucinationToggle from './hallucinator/HallucinationToggle.jsx'
import { useHallucination } from './hallucinator/HallucinationContext';


function Subtitles({textlog, editableTextlog, mobile,transVisible,keyboard,status,formData,handler,setHandler,setTextlog,setEditableTextlog, hyperionFlag,setHyperionFlag, messages,setMessages,setStatus, hyperionSummary,imageData,setImageData,additionalCharacters,tokenFlag, bakedCharacters, useBaked, hyperionNeeded, setHyperionNeeded,speaker,setSnapshots,snapshots,abortController, setAbortController, isStreamActive, setIsStreamActive,utterancesRef, timeoutIdsRef, clearAllTimeouts, activeTimeouts, downgraded=false,setDowngraded=null}) {
  
  const textRef = useRef(null);
  const keyboardInputRef = useRef();
  const [firstload,setFirstload] = useState(true);
  const [value, setValue] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [rerollDisabled, setRerollDisabled] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const { hallucinationOn } = useHallucination();





  // Used to check if there are tracked fields
  const hasTrackedFieldData = (fields) => {
    return fields.some(pair => pair.key.trim() !== '' || pair.value.trim() !== '');
}
  const generateFormattedString = (fields) => {
    return fields.map(pair => `| ${pair.key}: _`).join('| ');
}

const trackerString = formData.trackedFields 
  ? hasTrackedFieldData(formData.trackedFields) 
  ? `As a reminder, please track, update, and include the following attributes in your next response: ${generateFormattedString(formData.trackedFields)}`
  :'' 
  :''; 

  const reminderString = formData.reminderText 
  ? formData.reminderText 
    ? `Additionally, ${formData.reminderText}`
    : ''
    : ''

  const trackOrRemindString = trackerString
  ? reminderString
    ? `${trackerString} \n ${reminderString}`
    : `${trackerString}`
    : reminderString
    ? `${reminderString}`
    : ''

  
  // Auto scroller
 useEffect(() => {
    const element = textRef.current;
    const override =(localStorage.getItem('disableAutoscroll') === 'true');
    if ((firstload || autoScroll) && !override) { // if narration is on, or is first time loading, or autoscroll is on, AND override is not set.
       smoothScrollToBottom(element);
      // element.scrollTop = element.scrollHeight;
        setFirstload(false);
    }
   console.log('subtitles think: ', hallucinationOn)
}, [textlog, editableTextlog]);

  
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(true);


  const addText = (newText) => {
    setText((prevText) => prevText + newText);
  };

  // stuff for the scroller 
  function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// smoothing scroll :
  function smoothScrollToBottom(element) {
      const start = element.scrollTop;
      const end = element.scrollHeight - element.clientHeight;
      const change = end - start;
      const duration = 150; // in ms
      let startTime = null;

      function animateScroll(currentTime) {
          if (!startTime) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = timeElapsed / duration;

          element.scrollTop = start + change * easeInOutQuad(progress);

          if (timeElapsed < duration) {
              requestAnimationFrame(animateScroll);
          }
      }

      function easeInOutQuad(t) {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      requestAnimationFrame(animateScroll);
  }

  
 const handleScroll = debounce((e) => {
    const element = e.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 10) {
        // added a small threshold to account for mobile quirks
        setAutoScroll(true);
    } else {
        setAutoScroll(false);
    }
}, 50); // 50ms debounce

  useEffect(() => {
    const element = textRef.current;
    element.addEventListener('touchmove', handleScroll);
    
    return () => {
        element.removeEventListener('touchmove', handleScroll);
    };
}, []);


  //disabling reroll
   useEffect(() => {
    let timer;
    if (rerollDisabled) {
      // Enable the button after 5 seconds
      timer = setTimeout(() => {
        setRerollDisabled(false);
      }, 7000);
    }
    // Cleanup function to clear the timer
    return () => {
      clearTimeout(timer);
    };
  }, [rerollDisabled]);
  
  //disabling message send
   useEffect(() => {
    let timer;
    if (submitDisabled) {
      // Enable the button after 5 seconds
      timer = setTimeout(() => {
        setSubmitDisabled(false);
      }, 4000);
    }
    // Cleanup function to clear the timer
    return () => {
      clearTimeout(timer);
    };
  }, [submitDisabled]);
  
  
  function handleChange(event) {
    setValue(event.target.value);
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight - 10 + 'px';
  }; // for text input entry
  const handleEditChange = (e) => {
    setEditableTextlog(e.target.value);
  }; // for editing ai messages
  
  const clearEditableTextlog = () => {
    setTextlog((prevText)=> prevText+ `${editableTextlog}`);
    setEditableTextlog('');
  };


  
  function sanitizeInput(text) {
  const strippedText = text.replace(/(<([^>]+)>)/ig, '');
  const sanitizedText = strippedText.replace(/\*{2}(.+?)\*{2}/g, '<strong>$1</strong>'); // this is swapping ** for strong.
  return sanitizedText;
}
  // REROLL LOGIC ----------------------
  async function handleReroll(event){
    event.preventDefault();
    setRerollDisabled(true);
    var newMessages = [...messages.filter(message => message.name !== 'reminder')];
     var newPrimaryPrompt = generatePrimaryPrompt(formData,additionalCharacters,bakedCharacters,useBaked,'Ask the player what they do in each decision.');
    newMessages[0] = {role: "system", content:newPrimaryPrompt};
    if (trackOrRemindString !== "") {
        let lastMessage = newMessages[newMessages.length - 1];
        newMessages = newMessages.slice(0, newMessages.length - 1);
        newMessages.push({ name: 'reminder', role: 'system', content: `SYSTEM PROVIDED REMINDER: ${trackOrRemindString}` });
        newMessages.push(lastMessage);
    }
    await setMessages(newMessages);    
    setEditableTextlog('');
    setHandler(handler +1);
    setStatus("thinking")
            setValue("")
            return;
  }

  // this doesn't actually do anything but sends an alert, and kicks them off
  // I had a real creep who kept playing on VPNs and I couldn't figure out how to get rid of them.
  // Honestly a big part of why I stopped working on this game.
  // They were consistent in what they played, so I just set a flag for that game that would kick them to google.
  async function scareCreep() {
     alert("Seek professional help. Stop playing my game.") 
     window.location = "https://www.google.com/search?q=How+to+find+a+therapist";
  }
  
  async function handleSubmit(event,text) { // this would actually be better as a a separate function... technical debt here.
    event.preventDefault();
    setSubmitDisabled(true);
    // kindergarten catch
    // if adventure is virtual reality && handler == 0 and text contains "kindergarten"
    if(text.includes("kindergarten") && handler <=1 && formData.name2=="Jane Doe" && formData.name1=="Joe Smith"){
      scareCreep();
    }
    if(status==="reading" || status==="speaking"){
      // logic to handle snapshots:
      const newSnapshot = {
        messages: [...messages],
        textlog: `${textlog}`,
        lastmessage: `${editableTextlog}`,  // some logic to determine if this turn is a checkpoint
        // ... other game state data
      };
      setSnapshots(newSnapshot) // previous code - can be used for extending to 2+ snapshots//prevSnapshots => [...prevSnapshots, newSnapshot]);

      
    if(messages.filter(message => message.name !== 'reminder').length >= 16 || hyperionFlag ||hyperionNeeded.current){
      // case when hyperion
           // console.log("setting hyperion message")
            const hSummary = await hyperionSummary;
            const starterPrompt = generatePrimaryPrompt(formData, additionalCharacters,bakedCharacters,useBaked,'Ask the player what they do in each decision.'); 
      console.log(`${useBaked}: ${bakedCharacters}`)
     
            await setMessages([{ role: "system", content: starterPrompt },
                               { role: "system", content: `Game resume. Summary of game so far: ${hSummary}` },
                               {role: "assistant", content: editableTextlog},
                               ...(trackOrRemindString!="" ? [{ name: 'reminder', role: 'user', content: `SYSTEM PROVIDED REMINDER:  ${trackOrRemindString}` }] : []),

                               { role: "user", content: text }])
            //clear editable goes here - does the above make sense?
            clearEditableTextlog();
            console.log(messages)
            //console.log("Hyperion Message Set")
            const newUserString = `\n---\n**${formData.name1}(you): ** `+text +`\n---\n`;
            setTextlog((prevText) => prevText +sanitizeInput(newUserString))
            setHandler(handler +1);
      setStatus("thinking");
            setValue("")
            //setHyperionFlag(false);
            return(text);

          } else {
          // case where no hyperion
              const newMessages = [...messages];
              var newPrimaryPrompt = generatePrimaryPrompt(formData,additionalCharacters,bakedCharacters,useBaked,'Ask the player what they do in each decision.');
      console.log(`${useBaked}: ${bakedCharacters}`)
              newMessages[0] = {role: "system", content:newPrimaryPrompt};

        setMessages([...newMessages.filter(message => message.name !== 'reminder'), 
                     {role: "assistant", content: editableTextlog},
                     ...(trackOrRemindString!="" ? [{ name: 'reminder', role: 'system', content: `SYSTEM PROVIDED REMINDER: ${trackOrRemindString}` }] : []),
                     { role: "user", content: text }] )
      clearEditableTextlog();
        
        const newUserString = `\n---\n**${formData.name1}(you): ** `+text +`\n---\n`;
        setTextlog((prevText) => prevText +sanitizeInput(newUserString))
        setHandler(handler + 1)
      setStatus("thinking")
      setValue("")
  }
          keyboardInputRef.current.style.height = 'auto'; // in all cases resize textarea

  }
  }

  useEffect(()=>{
    if(downgraded && handler>10){
      setTextlog((prevText)=> prevText+ `\n-----\nEntering free mode! Hallucinator has been disabled and model has been set to a model in your tier.\n\nFor continued Hallucinator access and better models, <a href="/plans">sign up for a subscription!<a/> \n-----\n`);
    }
  },[downgraded])

  const handleKeyDown = (e,value) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if(!submitDisabled){
      handleSubmit(e,value);
      }
      }
  };
  
  return (
    <>
       
      <div
        className="subtitles-container"
      >
        <Hallucinator darkMode={darkMode} mobile={mobile} downgraded={downgraded}/>
       
     
    <div className="subtitles"
      ref={textRef}
      onScroll={handleScroll}
      style={{
          visibility: transVisible ? 'visible' : 'hidden',
          fontSize: `${fontSize}px`,
          backgroundColor: darkMode ? '#2b2e3b' : '#fff',
          color: darkMode ? '#fff' : '#000',
          height: mobile ?
            hallucinationOn ?
            '38vh' : '42vh'
            : hallucinationOn ?
            '30vh' : ' 60vh',
        // Add other styles as needed
        }}
    >
      <FontSizeToggle fontSize={fontSize} setFontSize={setFontSize} />
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <HallucinationToggle downgraded={downgraded}/>
      
      {parse(textlog)}
      <TextareaAutosize
              value={editableTextlog}
              onChange={handleEditChange}
              className={`editable-text ${(isStreamActive && editableTextlog==='') ? 'wave-background':''}`}
              onScroll={handleScroll}
              disabled = {keyboard.current ? false : true}
              placeholder = {isStreamActive ? "Thinking...":""}
        style={{
          visibility: transVisible ? 'visible' : 'hidden',
          fontSize: `${fontSize}px`,
          color: darkMode ? '#fff' : '#000',
          borderRight: keyboard.current ? null : '0px'
        }}
            />
    </div>
       
      {keyboard.current &&
        <form onSubmit={ (e) => handleSubmit(e,value)}>
      <div className="keyboard-input">
        <RewindButton snapshots={snapshots} setSnapshots={setSnapshots} setMessages={setMessages} messages={messages} setTextlog={setTextlog} setEditableTextlog={setEditableTextlog} />
        <textarea 
          id="keyboard-input"
          className="keyboard-textarea"
      value={value}
          ref={keyboardInputRef}
      onChange={handleChange}
          onKeyDown={(e)=>handleKeyDown(e,value)}
          onScroll={handleScroll}
          style={{
      visibility: keyboard.current ? 'visible' : 'hidden',
      backgroundColor: status === 'reading' ? '#191919' : '#2b2e3b',
      border: status === 'reading' ? '1px solid #007a7a' : 'none'
        }}
          ></textarea>
        {(isStreamActive || utterancesRef.current.length > 1 || timeoutIdsRef.current.length > 1) ? <> <StopStreamingButton abortController={abortController} setAbortController={setAbortController} isStreamActive={isStreamActive} setIsStreamActive={setIsStreamActive} timeoutIdsRef={timeoutIdsRef} utterancesRef={utterancesRef} clearAllTimeouts={clearAllTimeouts} setStatus={setStatus} jiggle={()=>{setValue(value+' ')}}/>  </>
          :<>
        <div>

         <button
        type="submit"
        disabled={(isStreamActive || submitDisabled) 
        ? true 
        : false}
        style={{
          color: (submitDisabled) ? 'gray'  
            : '#007a7a'
            }}

        className="keyboard-submit-button"
      >
          <FaPaperPlane 
            style={{
              color: (submitDisabled) ? 'gray' : '#007a7a'
            }}
              />
        </button>
          </div>
        <div>
         <button
        onClick= {handleReroll}
        disabled={rerollDisabled || editableTextlog===""}
        style={{
          color: (rerollDisabled) ? 'gray' : editableTextlog!==""
            ? editableTextlog==="" ? 'gray' : '#007a7a'
            : 'gray'}}

        className="keyboard-submit-button"
      >
          <FaDice 
            style={{
             color: (rerollDisabled) ? 'gray' :  editableTextlog!==""
            ? editableTextlog==="" ? 'gray' : '#007a7a'
            : 'gray'}}

              />
        </button>
          </div> </>}
      </div>
          </form>
      }  </div>
      </>
  );
}

export default Subtitles;

