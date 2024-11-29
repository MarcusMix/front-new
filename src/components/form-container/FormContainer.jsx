import React from 'react';
import './FormContainer.css'; // Importar o CSS associado

const FormContainer = ({ children }) => {
  return <div className="form-container">{children}</div>;
};

export default FormContainer;
