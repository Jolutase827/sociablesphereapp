import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Textarea,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import axios from "axios";
const DialogText = ({ openText, handleOpenText, user, login }) => {
  const {
    register,
    handleSubmit,
  } = useForm();
  const [loading,setLoading]=useState(false);
  
  const onSubmit = async (dataInput,e) => {
    setLoading(true);
    await axios.put("https://apisociablesphere-production.up.railway.app/api/users/"+user.id,{name:user.name, last_name: user.last_name, description:dataInput.description,role: dataInput.role},{
      headers: {
        Authorization: `Bearer ${user.api_token}`
      }
    })
    .then(response=>{
      const userAux = response.data;
      if(localStorage.getItem('user')!==null)
          localStorage.setItem('user',JSON.stringify(userAux));
      sessionStorage.setItem('user',JSON.stringify(userAux));
      login(userAux);
    })
    handleOpenText();
    setLoading(false);
  };
  return (
    <Dialog open={openText} handler={handleOpenText}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader className="logo-font">
          Welcome to SociableSphere {user.user_name}.
        </DialogHeader>

        <DialogBody className="col-12">
          <div className="col-12 flex flex-col items-center">
            <div className="col-12 text-black">
              You can add more information about you.
            </div>
            <div className="col-11 mt-3">
              <div>Why do you need your account?</div>
              <select className="mt-1" defaultValue="normal"  {...register("role")}>
                <option value="business" >To promote your business</option>
                <option value="normal">To enjoy the social media</option>
              </select>
              <div className="mt-2">
                Do you want to add one description about your profile
              </div>
              <div className="mt-1">
                <Textarea label="Desciption" {...register("description")}/>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex-row-reverse justify-start">
          <Button variant="gradient" color="cyan" type="submit" {...(loading? {loading: true}:{})}>
            <span>Next</span>
          </Button>
          <Button
            variant="text"
            color="gray"
            type="button"
            onClick={handleOpenText}
            className="me-2"
          >
            <span>Skip</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default DialogText;
