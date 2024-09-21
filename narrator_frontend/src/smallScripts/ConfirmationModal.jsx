const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='edit-popup'>
      <div className='modal-content'>
        <h2>Are you sure?</h2>
        <p>Do you really want to delete this character? This process cannot be undone.</p>
        <button onClick={onConfirm}>Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;