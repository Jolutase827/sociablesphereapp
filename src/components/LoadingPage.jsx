import React from 'react'
import logo from "../assets/Logo SocialSphere sin fondo.png" 
import { Spinner } from '@material-tailwind/react'
const LoadingPage = () => {
  return (
    <>
        <img src={logo} alt="Logo" className='col-2 mt-5' />
        <Spinner color='blue' className='mt-5 h-12 w-12 mb-5'/>
    </>
  )
}

export default LoadingPage