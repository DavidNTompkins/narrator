import React from 'react';
import { FiEdit } from 'react-icons/fi'; // Importing the pencil icon from Feather icons

const EditButton = ({editLink}) => {
  return (
      <div className="edit-published-button">
      <a href={editLink} target="_blank" rel="noopener noreferrer">
        <FiEdit color="#b4ecee" />
      </a>
    </div>
  );
};

export default EditButton;
