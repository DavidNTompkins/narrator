import './stopstreaming.css';
const StopStreamingButton = ({ abortController,setAbortController,isStreamActive,setIsStreamActive,utterancesRef,timeoutIdsRef,clearAllTimeouts, setStatus,jiggle}) => {

  
  const handleStopClick = () => {
    if (abortController) {
      abortController.abort();
      clearAllTimeouts()
      setIsStreamActive(false);
      setStatus("reading");
      console.log('Stream aborted');
      //if(speaker.current==true){
        // this breaks ongoing conversation but something like it might be able to fix longstanding audio bug.
        const synth = window.speechSynthesis;
        synth.cancel();
        jiggle();
        utterancesRef.current=[];
    }
  };


  return (
    <div>
    <button type="button" className="stop-stream-button" onClick={handleStopClick}>Interrupt</button>
      </div>
      );
};

export default StopStreamingButton;