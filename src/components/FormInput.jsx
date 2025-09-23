import React from 'react';

export const FormInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = 'text', 
  placeholder,
  required = false 
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-input ${error ? 'error' : ''}`}
        placeholder={placeholder}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};