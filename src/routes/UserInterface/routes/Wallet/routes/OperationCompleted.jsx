import React from 'react'
import { useNavigate } from 'react-router-dom'

const OperationCompleted = () => {

    const navigate = useNavigate();

  return (
    <div className='col-12 h-[70vh] flex flex-col items-center justify-center'>
        <div className='text-[50px] text-center col-11 font-semibold'>The transaction was completed</div>
        <img className='col-4 col-sm-3 col-md-2 col-lg-1 mt-1' src='https://upload.wikimedia.org/wikipedia/commons/7/73/Flat_tick_icon.svg'   alt="My tick SVG"/>
        <div className='cursor-pointer text-gray-500 underline hover:text-black transition hover:transition mt-2 text-[20px]' onClick={()=>navigate("/user-interface/wallet")}>Go to my wallet</div>
    </div>
  )
}

export default OperationCompleted