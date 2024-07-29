import React from 'react'
import { Login as LoginComponent, DarkMode } from '../components'

function Login() {
  return (
    <>
        <div className='h-screen flex items-center justify-center'>
            <LoginComponent />
        </div>
    </>
  )
}

export default Login