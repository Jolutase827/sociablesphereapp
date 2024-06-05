import React, { useEffect, useState } from 'react'
import getUserImage from '../../../../../functions/helpers/UserImage';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Textarea } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import LoadingPage from '../../../../../components/LoadingPage';
import Message from '../components/Message';

const Chat = ({user}) => {
  const [loading,setLoading] = useState(true);
  const { register, handleSubmit, setValue } = useForm();
  const [loadingCreateMessage,setLoadingCreateMessage] = useState(false);
  const { chat_id } = useParams();
  const [userToChat,setUserToChat] = useState(null);
  const [messages,setMessages] = useState([]);
  const navigate = useNavigate();
  const addMessage = async (dataInput, e) => {
    if (dataInput.text !== "") {
      setLoadingCreateMessage(true);
      await axios
        .post(
          "https://apisociablesphere-production.up.railway.app/api/messages",
          { chat_id: chat_id, text: dataInput.text },
          {
            headers: {
              Authorization: `Bearer ${user.api_token}`,
            },
          }
        )
        .then((response) => {
          setMessages([...messages,response.data]);
          setValue("text", "");
        })
        .catch((error) => console.log(error));
      setLoadingCreateMessage(false);
    }
  };

  const getUserToChat = async ()=>{
    setLoading(true);
    await axios.post("https://apisociablesphere-production.up.railway.app/api/chat",{chat_id: chat_id},{
      headers: {
        Authorization: `Bearer ${user.api_token}`,
      }}).then(response=>{
        let chat = response.data;
        if(chat.user_1.id===user.id){
          setUserToChat(chat.user_2);
        }else{
          setUserToChat(chat.user_1);
        }
        setMessages(chat.messages);
      })
      setLoading(false);
  }

  useEffect(()=>{
    getUserToChat();
  },[chat_id]);

  const goToProfile = ()=>{
    navigate("/user-interface/profile/"+userToChat.id);
  }

  return (
    <main className='col-12 flex flex-col items-center'>
      {loading?<LoadingPage/>:<><div className='col-11 col-md-6 flex items-center py-3'>
        <img src={getUserImage(userToChat)} alt="User to chat" className='w-[65px] h-[65px] rounded-full cursor-pointer shadow-lg' onClick={goToProfile}/>
        <div className='ms-1'>
          <div className='text-[20px] font-semibold cursor-pointer' onClick={goToProfile}>@{userToChat.user_name}</div>
          <div className='ms-3 font-semibold text-gray-600 cursor-pointer' onClick={goToProfile}>{userToChat.name}</div>
        </div>
      </div>
      {messages.length===0?<div className='col-12 col-md-6  h-[55vh] flex items-center justify-center bg-cyan-100'>
        <div className='logo-font col-6 text-[30px] text-center'>Start a conversation with @{userToChat.user_name}!</div>
      </div>:<div className='col-12 col-md-6  min-h-[55vh] max-h-[55vh] flex flex-col overflow-y-scroll items-end bg-cyan-100'>
          {messages.map((message,index)=>
            <Message message={message} key={index} userToShow={userToChat} user={user}/>
          )}
      </div>}
      <form
              onSubmit={handleSubmit(addMessage)}
              className="flex col-12 col-md-6 flex-row items-center gap-2 rounded-[99px] border border-gray-900/10 bg-gray-900/5 p-2 mt-2"
            >
              <Textarea
                rows={1}
                resize={true}
                placeholder="Your Message"
                className="min-h-full !border-0 focus:border-transparent"
                containerProps={{
                  className: "grid h-full",
                }}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                {...register("text")}
              />
              <div>
                <Button
                  variant="gradient"
                  color="blue"
                  type="submit"
                  className="rounded-full"
                  {...(loadingCreateMessage ? { loading: true } : {})}
                >
                  <i className="bi bi-send text-[25px]"></i>
                </Button>
              </div>
            </form></>}
    </main>
  )
}

export default Chat