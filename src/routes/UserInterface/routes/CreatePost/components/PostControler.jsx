import React from 'react'

const PostControler = ({filePost,typeFile,errorContent}) => {
  if(typeFile==="image"){
    return (
        <img src={filePost} alt="Foto Post" className='w-[350px] h-[350px] shadow-sm'/>
    );
  }
  if(typeFile==="video"){
    return (
        <video src={filePost} className='w-[350px] h-[350px]' autoPlay={true}/>
    );
  }
  return (
        <div className={`w-[350px] h-[350px] rounded-md border-dashed border-[4px]  flex justify-center items-center cursor-pointer hover:border-gray-800 active:border-black  hover:text-gray-800 active:text-black flex-col ${errorContent?"border-red-500 text-red-500":"border-gray-500 text-gray-500"}`}>
            <i className="bi bi-card-image text-[100px]"></i>
             <div className='flex justify-center items-center text-[20px] '>
              <i className="bi bi-arrow-bar-up"></i> 
              <div>Upload imageor video</div>
             </div>
        </div>
  );
}

export default PostControler