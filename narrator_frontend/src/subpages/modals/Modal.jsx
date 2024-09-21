import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, isOpen, closeModal }) => {
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      {children}
      <button className="cancel-button" onClick={closeModal}>Cancel</button>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
