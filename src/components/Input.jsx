import React, {useId} from 'react'

function Input({
    label,
    type = 'text',
    value,
    className = '',
    ...props
}, ref) {
  const id = useId() 
  return (
    
    <div>
    {
    label && <label 
    htmlFor={id} 
    className="block text-sm font-medium text-black dark:text-white mb-1"
    >{label}
    </label>
    }
    <input 
    type={type}
    value={value}
    className={`${className}`}
    ref={ref}
    id={id}
    {...props}
    />
    </div>
  )
}

export default React.forwardRef(Input)