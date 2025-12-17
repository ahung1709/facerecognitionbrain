// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ children }) => {
  return ReactDOM.createPortal(children, document.getElementById('modal-root'));
};

export default Modal;
