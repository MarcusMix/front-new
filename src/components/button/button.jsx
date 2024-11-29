// Button.js
import React from 'react';
import './button.css'; // Se você quiser adicionar estilos personalizados de botão

const MyButton = ({ type, label, onClick }) => {
  return (
    <button type={type} className="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default MyButton;
