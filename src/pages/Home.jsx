import React from 'react'
import { Sidebar } from '../components'
import { Outlet } from 'react-router-dom'

function Home() {
  return (
    <>
    <div className='flex flex-col sm:flex-row'>
        <Sidebar />
        <div className='sm:flex-grow sm:ml-20'>
        <Outlet />
        </div>
        
    </div>
    </>
  )
}

export default Home