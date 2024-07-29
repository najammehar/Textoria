import React from 'react'
import { DarkMode, Footer1, Hero, Navbar1 } from '../components'

function LandingPage() {
  return (
    <>
    <Navbar1 />
    {/* <DarkMode className={"fixed bottom-4 right-4"} dIcon='dark:text-black' lIcon='text-white' /> */}
    <Hero />
    <Footer1 />
    </>
  )
}

export default LandingPage