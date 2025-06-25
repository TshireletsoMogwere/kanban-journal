
import React from "react";

export default function Button({ onClick, children, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
