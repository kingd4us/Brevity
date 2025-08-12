import React from 'react';

// This allows our component to accept all the standard props of an HTML input element
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props} // Spread all the passed-in props (like type, placeholder, etc.)
      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className}`}
    />
  );
};

export default Input;