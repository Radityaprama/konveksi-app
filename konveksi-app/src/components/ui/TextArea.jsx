import React from 'react';

const Textarea = ({ 
  label, 
  error, 
  className = '',
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={props.id || props.name} 
          className="block text-gray-700 mb-2 font-medium"
        >
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Textarea;