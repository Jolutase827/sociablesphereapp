import { Button, Dialog, DialogBody,DialogFooter, DialogHeader } from '@material-tailwind/react'
import axios from 'axios';
import React, { useState } from 'react'

const DialogDeletePost = ({openDelete,handleOpenDelete,post,deletePost,user}) => {
    const [loading,setLoading] = useState(false);
    const apiDeletePost = async ()=>{
        setLoading(true);
        await axios.delete("https://apisociablesphere-production.up.railway.app/api/posts/"+post.id,{
            headers: {
              Authorization: `Bearer ${user.api_token}`,
            },
          }).then(response=>{
            deletePost(post);
          }).catch(error=>console.error(error));
        setLoading(false);
        handleOpenDelete();
    }
  return (
    <Dialog open={openDelete} handler={handleOpenDelete}>
        <DialogHeader>
          <h1 className='logo-font'>SociableSphere</h1>
        </DialogHeader>
        <DialogBody className="col-12">
          <div className="col-12 flex text-black text-[20px] justify-center items-center">
            Are you sure that you want to delete this post?
          </div>
        </DialogBody>
        <DialogFooter className="flex-col-reverse p-3 items-center justify-center">
          <Button variant="text" color="red" fullWidth onClick={apiDeletePost} {...(loading? {loading: true}:{})}>
            <span>Delete</span>
          </Button>
          <Button
            variant="text"
            color="gray"
            type="button"
            fullWidth
            onClick={handleOpenDelete}
            className="me-2"
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
    </Dialog>
  )
}

export default DialogDeletePost