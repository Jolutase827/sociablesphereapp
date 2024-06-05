import {
  DialogHeader,
  Dialog,
  DialogBody,
  Button,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import React, { useState } from "react";
import getUserImage from "../../../../../functions/helpers/UserImage";
import { useForm } from "react-hook-form";
import axios from "axios";

const EditProfile = ({ openEdit, handleOpenEdit, user, login }) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(getUserImage(user));
  const [image, setImage] = useState(null);
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

  const onSubmit = async (dataInput, e) => {
    setLoading(true);
    await axios
      .put(
        "https://apisociablesphere-production.up.railway.app/api/users/" + user.id,
        {
          name: dataInput.name,
          last_name: dataInput.last_name,
          description: dataInput.description,
          role: user.role,
        },
        {
          headers: {
            Authorization: `Bearer ${user.api_token}`,
          },
        }
      )
      .then((response) => {
        const userAux = response.data;
        if (localStorage.getItem("user") !== null)
          localStorage.setItem("user", JSON.stringify(userAux));
        sessionStorage.setItem("user", JSON.stringify(userAux));
        login(userAux);
      })
      .catch((error) => console.error(error))
      .finally(async () => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("photo", image);
        await axios
          .post("https://apisociablesphere-production.up.railway.app/api/new_profile_image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.api_token}`,
            },
          })
          .then((response) => {
            const userAux = response.data;
            if (localStorage.getItem("user") !== null)
              localStorage.setItem("user", JSON.stringify(userAux));
            sessionStorage.setItem("user", JSON.stringify(userAux));
            login(userAux);
          })
          .catch((error) => alert(error.message));
        setLoading(false);
        handleOpenEdit();
      });
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  return (
    <Dialog open={openEdit} handler={handleOpenEdit}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader className="logo-font">
          Settings @{user.user_name}.
        </DialogHeader>

        <DialogBody className="col-12 max-h-[400px] overflow-y-scroll">
          <div className="col-12 flex flex-col items-center">
            <div className="col-11 mt-3 ">
              <label
                htmlFor="image"
                className="flex justify-center items-center col-12 flex-col"
              >
                <img
                  src={selectedImage}
                  alt="imagen"
                  className=" rounded-full shadow-sm w-[150px] h-[150px] cursor-pointer clip-path-upload-image"
                />
                <Button variant="filled" className="mt-2 p-2" type="button">
                  <label htmlFor="image" className="cursor-pointer text-[10px]">
                    <i className="bi bi-arrow-bar-up "></i> Upload image
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
            <div className="col-7 mt-3">
              <Input
                variant="standard"
                label="Name*"
                placeholder="Name*"
                defaultValue={user.name}
                {...register("name", {
                  required: "Please, complete the required fieldes",
                })}
                aria-invalid={errors.name ? "true" : "false"}
                {...(errors.name ? { error: true } : {})}
              />
            </div>
            <div className="col-7 mt-3">
              <Input
                variant="standard"
                label="Last name*"
                placeholder="Last name*"
                defaultValue={user.last_name}
                {...register("last_name", {
                  required: "Please, complete the required fieldes",
                })}
                aria-invalid={errors.last_name ? "true" : "false"}
                {...(errors.last_name ? { error: true } : {})}
              />
            </div>
            <div className="col-7 mt-3">
              <Textarea
                label="Description"
                defaultValue={user.description}
                {...register("description")}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="col-12 items-center flex-col">
          {(errors.last_name || errors.name) && (
            <div className="mt-2 text-red-500">
              Please, complete all the fieldes
            </div>
          )}
          <div className="flex flex-row-reverse justify-start col-12">
            <Button
              variant="gradient"
              color="cyan"
              type="submit"
              {...(loading ? { loading: true } : {})}
            >
              <span>Update</span>
            </Button>
            <Button
              variant="text"
              color="gray"
              type="button"
              onClick={handleOpenEdit}
              className="me-2"
            >
              <span>Close</span>
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default EditProfile;
