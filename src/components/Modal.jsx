import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

// We get 'isOpen' (to show/hide) and 'onClose' (to close it)
// 'children' is a special prop that means "whatever you put inside me"
function Modal({ isOpen, onClose, children }) {
  // If the modal isn't open, render nothing
  if (!isOpen) return null;

  // Otherwise, create a portal to the 'modal-root' div
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times; {/* This is an 'X' icon */}
        </button>
        {children} {/* This is where our form will go */}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

export default Modal;