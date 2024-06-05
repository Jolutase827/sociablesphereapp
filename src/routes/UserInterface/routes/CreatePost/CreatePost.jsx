import {
  Button,
  Input,
  Switch,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import PostControler from "./components/PostControler";
import axios from "axios";
import { useForm } from "react-hook-form";
import comprobeFloat from "../../../../functions/helpers/ComprobeFloat";
import { useNavigate } from "react-router-dom";
import comprobeIntegerLessThan100 from "../../../../functions/helpers/ComprobeIntegerLessThan100";

const CreatePost = ({ user, login }) => {
  const [filePost, setFilePost] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [hasCost, setHasCost] = useState(false);
  const [hasPeople, setHasPeople] = useState(false);
  const [typeFile, setTypeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorContent, setErrorContent] = useState(false);
  const [errorCost, setErrorCost] = useState(false);
  const [errorPeople, setErrorPeople] = useState(false);
  const [errorDetailsPeople, setErrorDetailsPeople] = useState(false);
  const [errorNotEnoghMoney, setErrorNotEnoghMoney] = useState(false);
  const [errorDeailsCost, setErrorDetailsCost] = useState(false);

  const navigateTo = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (dataInput, e) => {
    setLoading(true);
    const formData = new FormData();
    let type;
    if (dataInput.content === "" && dataFile === null) {
      setErrorContent(true);
    } else if (hasCost && dataInput.cost === "") {
      setErrorCost(true);
    } else if (hasCost && comprobeFloat(dataInput.cost)) {
      setErrorDetailsCost(true);
    } else if (hasPeople && dataInput.people === "") {
      setErrorPeople(true);
    } else if (hasPeople && comprobeIntegerLessThan100(dataInput.people)) {
      setErrorDetailsPeople(true);
    } else if (hasPeople && user.wallet < parseInt(dataInput.people) * 0.5) {
      setErrorNotEnoghMoney(true);
    } else {
      if (hasPeople) {
        await axios
          .get(
            "https://apisociablesphere-production.up.railway.app/api/wallet/-" +
              parseInt(dataInput.people) * 0.5,
            {
              headers: {
                "Content-Type": "multipart/form-data",
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
          .catch((error) => alert(error.message));
      }
      if (dataFile === null) {
        type = 1;
        formData.append("content", dataInput.content);
      } else if (typeFile === "image") {
        type = hasCost ? 6 : 2;
        type = hasPeople ? 4 : type;
        formData.append("photo", dataFile);
        formData.append("footer", dataInput.content);
      } else {
        type = hasCost ? 7 : 3;
        type = hasPeople ? 5 : type;
        formData.append("video", dataFile);
        formData.append("footer", dataInput.content);
      }
      formData.append("type", type);
      if (hasCost) {
        formData.append(
          "cost",
          parseFloat(String(dataInput.cost).replace(",", "."))
        );
      }
      if (hasPeople) {
        formData.append("reward", parseInt(dataInput.people));
      }
      await axios
        .post("https://apisociablesphere-production.up.railway.app/api/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.api_token}`,
          },
        })
        .then((response) => {
          setFilePost(null);
          setDataFile(null);
          setTypeFile(null);
          setHasCost(false);
          navigateTo(
            "/user-interface/profile/" + user.id + "#" + response.data.id
          );
        })
        .catch((error) => console.error(error));
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    setErrorContent(false);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    if (file && (fileType === "image" || fileType === "video")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePost(reader.result);
      };
      setTypeFile(fileType);
      setDataFile(file);
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="col-12 items-center flex justify-center bg-cyan-200">
      <form
        className="col-12 col-md-8 shadow-md rounded-sm bg-white flex items-center flex-col py-5 px-5 mt-4 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="col-12 text-[35px] font-amiko">Create your post</h1>
        <div className=" col-10 col-md-6 pt-3 text-[30px]">
          <Textarea
            variant="outlined"
            label="What do you want to share?*"
            onInput={(e) => setErrorContent(false)}
            {...(errorContent ? { error: true } : {})}
            {...register("content")}
          />
        </div>
        <div className="col-6 pt-3">
          <label
            htmlFor="file"
            className="flex justify-center items-center col-12 flex-col"
          >
            <PostControler
              filePost={filePost}
              typeFile={typeFile}
              errorContent={errorContent}
            />
          </label>
          <input
            type="file"
            name="file"
            id="file"
            className="d-none"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </div>
        <div
          className={` mt-4 col-8 flex justify-around ${
            filePost === null ? "d-none" : ""
          }`}
        >
          {user.role === "normal" ? (
            <>
              <div className={`col-4 ${!hasCost && "d-none"}`}>
                <Input
                  variant="standard"
                  label="Cost by view €*"
                  placeholder="Cost by view €*"
                  onInput={(e) => {
                    setErrorCost(false);
                    setErrorDetailsCost(false);
                  }}
                  {...(errorCost || errorDeailsCost ? { error: true } : {})}
                  {...register("cost")}
                />
              </div>
              <div className={`col-7 ms-4 `}>
                <Switch
                  label={
                    <div>
                      <Typography color="blue-gray" className="font-medium">
                        Activate Cost
                      </Typography>
                      <Typography
                        variant="small"
                        color="gray"
                        className="font-normal"
                      >
                        If you want to have benefits of your post click here
                      </Typography>
                    </div>
                  }
                  containerProps={{
                    className: "-mt-5",
                  }}
                  ripple={false}
                  onClick={(e) => setHasCost(!hasCost)}
                />
              </div>
            </>
          ) : (
            <>
              <div className={`col-4 ${!hasPeople && "d-none"}`}>
                <Input
                  variant="standard"
                  label="Target audience size*"
                  placeholder="Target audience size*"
                  onInput={(e) => {
                    setErrorPeople(false);
                    setErrorDetailsPeople(false);
                    setErrorNotEnoghMoney(false);
                  }}
                  {...(errorPeople || errorDetailsPeople || errorNotEnoghMoney
                    ? { error: true }
                    : {})}
                  {...register("people")}
                />
              </div>
              <div className={`col-7 ms-4 `}>
                <Switch
                  label={
                    <div>
                      <Typography color="blue-gray" className="font-medium">
                        Create as add
                      </Typography>
                      <Typography
                        variant="small"
                        color="gray"
                        className="font-normal"
                      >
                        If you want to promote this post. The cost for person is
                        0.50€.
                      </Typography>
                    </div>
                  }
                  containerProps={{
                    className: "-mt-5",
                  }}
                  ripple={false}
                  onClick={(e) => setHasPeople(!hasPeople)}
                />
              </div>
            </>
          )}
        </div>
        {(errorContent || errorCost || errorPeople) && (
          <div className="col-12 text-center mt-4 text-red-500">
            Please, complete all fields.
          </div>
        )}
        {errorDeailsCost && (
          <div className="col-12 text-center mt-4 text-red-500">
            The cost have to be a number more than 0.
          </div>
        )}
        {errorDetailsPeople && (
          <div className="col-12 text-center mt-4 text-red-500">
            The target of people must be a number less than 100 and more than 0.
          </div>
        )}
        {errorNotEnoghMoney && (
          <div className="col-12 text-center mt-4 text-red-500">
            You haven't have enough money.
          </div>
        )}
        <div className="col-12 mt-4 flex justify-end">
          <Button
            variant="gradient"
            type="submit"
            color="cyan"
            {...(loading ? { loading: true } : {})}
          >
            Create post
          </Button>
        </div>
      </form>
    </main>
  );
};

export default CreatePost;
