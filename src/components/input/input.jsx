import React from 'react';
import './input.css'; // Certifique-se de que você tenha estilos apropriados

const Input = ({ type, name, placeholder, value, onChange, required }) => {
  return (
    <input 
      type={type} 
      name={name} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      required={required}
      className="input" // Adicione uma classe CSS se necessário
    />
  );
};

export default Input;
