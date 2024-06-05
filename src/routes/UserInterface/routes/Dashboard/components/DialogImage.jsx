import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";
import getUserImage from "../../../../../functions/helpers/UserImage";

const DialogImage = ({ openImage, handleOpenImage, user, login }) => {
  const [loading, setLoading] = useState(false);
  const [image,setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(getUserImage(user));

  

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("photo", image);
    await axios
      .post("https://apisociablesphere-production.up.railway.app/api/new_profile_image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.api_token}`
        },
      })
      .then((response) => {
        const userAux = response.data;
        if(localStorage.getItem('user')!==null)
            localStorage.setItem('user',JSON.stringify(userAux));
        sessionStorage.setItem('user',JSON.stringify(userAux));
        login(userAux);
      })
      .catch((error) => alert(error.message)); 
    setLoading(false);
    handleOpenImage();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };
  return (
    <Dialog open={openImage} handler={handleOpenImage}>
      <form onSubmit={onSubmit}>
        <DialogHeader className="logo-font">
          Welcome to SociableSphere {user.user_name}.
        </DialogHeader>

        <DialogBody className="col-12">
          <div className="col-12 flex flex-col items-center">
            <div className="col-12 text-black text-center">
              Do you want to add a profile picture?
            </div>
            <div className="col-11 mt-3 ">
              <label
                htmlFor="image"
                className="flex justify-center items-center col-12 flex-col"
              >
                <img
                  src={selectedImage}
                  alt="imagen"
                  className=" rounded-full shadow-sm w-[220px] h-[220px] cursor-pointer clip-path-upload-image"
                />
                <Button variant="filled" className="mt-2" type="button">
                  <label htmlFor="image" className="cursor-pointer">
                    <i className="bi bi-arrow-bar-up text-[15px]"></i> Upload image
                  </label>
                </Button>
              </label>
              <input
                type="file"
                name="image"
                id="image"
                className="d-none"
                onInput={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex-row-reverse justify-start">
          <Button
            variant="gradient"
            color="cyan"
            type="submit"
            {...(loading ? { loading: true } : {})}
          >
            <span>Send</span>
          </Button>
          <Button
            variant="text"
            color="gray"
            type="button"
            onClick={handleOpenImage}
            className="me-2"
          >
            <span>Close</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default DialogImage;
