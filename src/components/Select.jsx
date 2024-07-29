import React, {useId} from 'react'

function Select({
    options,
    label,
    className,
    ...props
}, ref) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor={id} className='block text-sm font-medium text-black dark:text-white mb-1'>{label}</label>}
        <select
        {...props}
        id={id}
        ref={ref}
        className={`duration-200 ${className}`}
        >
            {options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)