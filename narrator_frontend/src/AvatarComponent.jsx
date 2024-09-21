import React, { useEffect, useRef, useState } from "react";
import kingHandler from "./kingHandler.jsx";
import AudioQueue from "./audioQueue.js";
import sayAWord from "./smallScripts/sayAWord.js";
import { useLocation } from 'react-router-dom';
import { useHallucination } from './hallucinator/HallucinationContext';


function AvatarComponent({
  prompts,
  characters,
  messages,
  setMessages,
  imageData,
  setImageData,
  handler,
  setHandler,
  setStatus,
  browser,
  formData,
  textlog,
  setTextlog,
  editableTextlog,
  setEditableTextlog,
  transVisible,
  mobile,
  keyboard,
  speaker,
  hyperionSummary,
  setHyperionSummary,
  hyperionFlag,
  setHyperionFlag,
  user,
  save,
  adventureID,
  utterancesRef,
  additionalCharacters,
  bakedCharacters,
  useBaked,
  hyperionNeeded,
  setHyperionNeeded,
  rules,
  abortController,
  setAbortController,
  isStreamActive,
  setIsStreamActive,
  timeoutIdsRef,
  AISpokeLast=false,
}) {
  const [audioQueue] = useState(new AudioQueue());
  const location = useLocation();
  const qLength = useRef(0);
  const firstGo = useRef(!AISpokeLast);
  const { addImage, hallucinationOn } = useHallucination();
  const [guessedHallucinationStyles, setGuessedHallucinationStyles] = useState([]);

  //console.log(hyperionNeeded.current)

  useEffect(() => {
    console.log('AvatarComponent Mounted/Updated');

    return () => {
      console.log('AvatarComponent Unmounted');
    };
  }, []);

  // applying automated halluc styles - oddly the best place for this 





  
  useEffect(() => {
    console.log(status);
    console.log("Attempting KingHandle");
    if (firstGo.current || handler > 0) {
      kingHandler(
        messages,
        setMessages,
        handler,
        setHandler,
        audioQueue,
        qLength,
        setStatus,
        browser,
        hyperionFlag,
        setHyperionFlag,
        formData,
        textlog,
        setTextlog,
        editableTextlog,
        setEditableTextlog,
        keyboard,
        speaker,
        hyperionSummary,
        setHyperionSummary,
        user,
        save,
        adventureID,
        utterancesRef,
        imageData,
        setImageData,
        additionalCharacters,
        bakedCharacters,
        useBaked,
        hyperionNeeded,
        setHyperionNeeded,
        location,
        abortController,
        setAbortController,
        isStreamActive,
        setIsStreamActive,
        timeoutIdsRef,
        addImage,
        hallucinationOn
      );
    } 
    firstGo.current = false;
  }, [handler]); // update the dependency array

  // this is no longer used
  const ImageComponent = React.memo(function ImageComponent({ data, bio }) {
    const srcString = data[0] == "h" ? data : `data:image/png;base64,${data}`;
    return (
      <div type="image" style={{ width: mobile ? (transVisible ? "40vw" : "") : "" }}>
        <img src={srcString} style={{ WebkitTouchCallout: "none" }} alt="Image Loading..." />
        <h4>{bio}</h4>
      </div>
    );
  });

  return (
    <>
      
    </>
  );
}

const areEqual = (prevProps, nextProps) => {
  // Return true if you want the component NOT to re-render
  // Return false if you want the component to re-render
  return prevProps.imageData === nextProps.imageData;
};


export default React.memo(AvatarComponent);
