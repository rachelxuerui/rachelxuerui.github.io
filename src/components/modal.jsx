import React from 'react';
import '../App.css';

function Modal({ onClose, children, projectLink }) {  


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><object data="../assets/close.svg" type="image/svg+xml"></object></button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
