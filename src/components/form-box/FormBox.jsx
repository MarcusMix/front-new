import React from 'react';
import './FormBox.css'; // Importar o CSS associado

const FormBox = ({ children }) => {
  return <div className="form-box">{children}</div>;
};

export default FormBox;
