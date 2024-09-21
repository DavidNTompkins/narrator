import React from 'react';
import { FaStepBackward } from 'react-icons/fa';

const RewindButton = ({ snapshots, setSnapshots, setMessages, messages, setTextlog, setEditableTextlog }) => {
  const handleSnapshot =  () => {
    console.log('snapshots');
    // Set the snapshots state to contain only the current messages state
     setMessages(snapshots.messages);
     setTextlog(snapshots.textlog);
     setEditableTextlog(snapshots.lastmessage);
    setSnapshots(null);
  };

  return (
    <button
      onClick={handleSnapshot}
      disabled={!(snapshots)}
      style={{
        color: snapshots ? '#007a7a' : 'grey',
        marginLeft: '0',
        marginRight:'10px',
        marginTop:'2px',
      }}
      className="keyboard-submit-button"
      title="Undo last message"
    >
      <FaStepBackward 
        style={{
          color: snapshots ? '#007a7a' : 'grey'
        }}
      />
      
    </button>
  );
};

export default RewindButton;
