import React from 'react'
import { useNavigate } from 'react-router-dom'
import getUserImage from '../functions/helpers/UserImage';
import axios from 'axios';

const ShowChatAsList = ({userToShow,chat=null,setLoading,user}) => {
  const navigate = useNavigate();
  const goToChat = async ()=>{
    setLoading(true);
    await axios.post("https://apisociablesphere-production.up.railway.app/api/chat",(chat===null?{user_id:userToShow.id}:{chat_id:chat.id}),{
      headers: {
        Authorization: `Bearer ${user.api_token}`,
      }}).then(response=>{
        navigate("/user-interface/chats/chat/"+response.data.id);
      })
    setLoading(false);
  }
  return (
    <div className='col-12 transition hover:transition hover:bg-gray-300 cursor-pointer flex items-center p-2 rounded-sm' onClick={goToChat}>
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

export default ShowChatAsList