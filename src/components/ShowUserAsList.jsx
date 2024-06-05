import React from 'react'
import getUserImage from '../functions/helpers/UserImage'
import { useNavigate } from 'react-router-dom'

const ShowUserAsList = ({userToShow}) => {
    const navigate = useNavigate();
    const goToUser = ()=>{
        navigate("/user-interface/profile/"+userToShow.id);
    }
  return (
    <div className='col-12 transition hover:transition hover:bg-gray-300 cursor-pointer flex items-center p-2 rounded-sm' onClick={goToUser}>
        <img src={getUserImage(userToShow)} alt="User" className='w-[60px] h-[60px] rounded-full'/>
        <div className='flex flex-col justify-center ms-2'>
            <div className='text-[20px] text-black font-semibold'>
                @{userToShow.user_name}
            </div>
            <div className='text-[15px] text-gray-600 '>
                { userToShow.name }
            </div>
        </div>
    </div>
  )
}

export default ShowUserAsList