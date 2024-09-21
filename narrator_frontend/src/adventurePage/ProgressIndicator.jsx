import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ steps }) => {
  // Assuming steps is an array like [true, false, false] indicating the completion of each step

  const stepClass = (step) => {
    if (step) return 'completed';
    if (!step && steps[steps.indexOf(step)-1]) return 'inProgress';
    return 'inProgress';
  };

  return (
    <div className="progressIndicator">
      {steps.map((step, index) => (
        <div key={index} className={`orb ${stepClass(step)}`}></div>
      ))}
    </div>
  );
};

export default ProgressIndicator;

// Styles in CSS (ProgressIndicator.css)
/*

*/
