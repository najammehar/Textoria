import React , {useEffect , useState} from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const DarkMode = ({className, dIcon, lIcon}) => {
    const [theme, setTheme] = useState('null')

    useEffect(() => {
        if(window.matchMedia('(prefers-color-scheme:dark)').matches){
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }, [])
    
    useEffect(() => {
        if(theme === 'dark') 
            document.documentElement.classList.add('dark')
        else
            document.documentElement.classList.remove('dark')
    }, [theme])

    const toggleDarkMode = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }
    return (

            <button onClick={toggleDarkMode} className={className}>
                {theme === 'light' ? (
        <MdDarkMode className={`w-7 h-7 ${dIcon} `} />
      ) : (
        <MdLightMode className={`w-7 h-7 ${lIcon} `} />
      )}
            </button>

    )
}
export default DarkMode