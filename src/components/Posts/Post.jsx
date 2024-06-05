import React, { useEffect, useState } from "react";
import SkelletonText from "./skelletons/SkelletonText";
import SkelletonContent from "./skelletons/SkelletonContent";
import PostToEveryone from "./PostToEveryone";
import DialogDeletePost from "./DialogDelete";

const Post = ({ post,user,index,deletePost,suggested=false,add=false,login }) => {
  const [loading,setLoading]=useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = ()=> setOpenDelete(!openDelete);
  const load=async ()=>{
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  }

  useEffect(()=>{
    load();
  });
  

  return(<div className={`  col-12 flex justify-center `}>
    {loading?(post.type.id===1)?<SkelletonText/>:<SkelletonContent/>:<PostToEveryone post={post} handleOpenDelete={handleOpenDelete} user={user} suggested={suggested} add={add} login={login}  index={index}/>}
    <DialogDeletePost user={user} post={post} openDelete={openDelete} handleOpenDelete={handleOpenDelete} deletePost={deletePost}/>
  </div>);
  
};

export default Post;
