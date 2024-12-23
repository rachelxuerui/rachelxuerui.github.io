import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Modal({ onClose, children, projectLink }) {

  const navigate = useNavigate();  

  const handleExpandClick = () => {
    navigate(projectLink); 
  };


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className = "modal-options">
            <button className="modal-close" onClick={onClose}>X</button>
            <button className="modal-expand" onClick={handleExpandClick}>expand</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
