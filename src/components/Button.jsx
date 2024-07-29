import React from 'react'

function Button({
    children,
    type = 'button',
    className = '',
    ...props
}) {
  return (
    <button
    type={type}
    className={`duration-300 ${className}`}
    {...props}
    >
        {children}
    </button>
  )
}

export default Button