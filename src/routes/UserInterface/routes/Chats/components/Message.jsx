import React, { useEffect, useState } from 'react'
import getUserImage from '../../../../../functions/helpers/UserImage'
import { useNavigate } from 'react-router-dom';

const Message = ({message,userToShow,user}) => {
    const isOtherUser = parseInt(message.user_id)===parseInt(userToShow.id);
    const [userMessage,setUserMessaje] = useState(isOtherUser?userToShow:user);
    const navigate = useNavigate();
    useEffect(()=>{
        setUserMessaje(isOtherUser?userToShow:user);
    },[message])
    const date = new Date(message.created_at);
    const goToProfile = ()=>{
      navigate("/user-interface/profile/"+message.user_id);
    }
  return (
    <div className={`col-12 mt-1 px-2 flex items-center ${isOtherUser?"":"flex-row-reverse"}`}>
        <img src={getUserImage(userMessage)} alt="User" className='w-[60px] h-[60px] rounded-full shadow-md cursor-pointer' onClick={goToProfile}/>
        <div className={`p-2 shadow-md ms w-fit rounded-md ${isOtherUser?"bg-blue-400 ms-2":"bg-white me-2"}`}>
            <div className='max-w-[35vw] flex flex-wrap'>{message.text}</div>
            <div className={`text-[7px] ${isOtherUser?"text-black":"text-gray-600"}`}>{date.getDate() +
              "/" +
              date.getMonth() +
              "/" +
              date.getFullYear() +
              "-" +
              date.getHours() +
              ":" +
              date.getMinutes()}</div>
        </div>
    </div>
  )
}

export default Message