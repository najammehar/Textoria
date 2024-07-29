import React from 'react'
import { SignUp as SignUpComponent, DarkMode } from '../components'

function Login() {
  return (
    <>
        <div className='h-screen flex items-center justify-center'>
            <SignUpComponent />
            {/* <DarkMode /> */}
        </div>
    </>
  )
}

export default Login