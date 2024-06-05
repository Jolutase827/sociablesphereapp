import React, { useState } from "react";
import logo from "./../../assets/Logo SocialSphere sin fondo.png";
import { Button, Input, Spinner } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import {  useForm } from "react-hook-form";
import axios from "axios";

const Register = ({ login }) => {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [errorPaswordCompatible, setErrorPasswordCompatible] = useState(false);
  const [errorUserName,setErrorUserName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = async (dataInput, e) => {
    setWaiting(true);
    if (dataInput.password !== dataInput.reppassword)
      setErrorPasswordCompatible(true);
    else
      await axios
        .post("https://apisociablesphere-production.up.railway.app/api/register", {
          user_name: dataInput.user_name,
          email: dataInput.email,
          name: dataInput.name,
          last_name: dataInput.last_name,
          password: dataInput.password,
        })
        .then((response) => {
          let user = JSON.stringify(response.data.user);
          sessionStorage.setItem("user", user);
          login(JSON.parse(user));
          navigate("/user-interface/dashboard/true");
        })
        .catch((error) =>{ 
          if(error.response.data.code==="name")
            setErrorUserName(true);
          if(error.response.data.code==="email")
            setErrorEmail(true);
      });
    setWaiting(false);
    
  };

  return (
    <main className=" col-12">
      <div className="d-flex col-12 flex-column-reverse flex-sm-row">
        <div className="h-[100vh]  col-12 col-sm-6   container-photo-register">
          <div className="col-12 h-[100%] flex justify-center items-center flex-col bg-blue-app-light">
            <img src={logo} alt="Logo" className="col-3" />

            <div className="mt-3  flex flex-col items-center text-color-dark-blue contenedor inicio">
              <h3 className="text-[40px] col-8 text-center font-semibold logo-font">
                Enjoy the best social media!
              </h3>
              <h5 className="text-center mt-3 col-7 text-[25px] font-medium font-random">
                Earn money watching ads and you have the freedom to disable them
                whenever you want! Join now and make the most of your time
                online.
              </h5>
            </div>
          </div>
        </div>
        <div className="h-[100vh] col-12 col-sm-6 p-4">
          <h1 className="logo-font h-[10%] text-end text-[30px]">
            SociableSphere
          </h1>
          <form className="col-12 mh-[80%]  d-flex justify-center items-center flex-col">
            <h2 className="col-11 mb-3 font-semibold text-[30px]">Register</h2>
            <div className="col-10">
              <Input
                variant="standard"
                label="User name*"
                placeholder="User name*"
                color="blue"
                {...register("user_name", {
                  required: "Please, complete all the fieldes",
                })}
                aria-invalid={errors.user_name ? "true" : "false"}
                {...(errors.user_name||errorUserName ? { error: true } : {})}
                onInput={(e)=>setErrorUserName(false)}
              />
            </div>
            <div className="col-10 mt-3">
              <Input
                type="email"
                variant="standard"
                label="Email*"
                placeholder="Email*"
                color="blue"
                {...register("email", {
                  required: "Please, complete all the fieldes",
                })}
                aria-invalid={errors.email ? "true" : "false"}
                {...(errors.email||errorEmail ? { error: true } : {})}
                onInput={(e)=>setErrorEmail(false)}
              />
            </div>
            <div className="col-10 mt-3 ">
              <Input
                variant="standard"
                label="Name*"
                placeholder="Name*"
                color="blue"
                {...register("name", {
                  required: "Please, complete all the fieldes",
                })}
                aria-invalid={errors.name ? "true" : "false"}
                {...(errors.name ? { error: true } : {})}
              />
            </div>
            <div className="mt-3 col-10">
              <Input
                variant="standard"
                label="Lastname*"
                placeholder="Lastname*"
                color="blue"
                {...register("last_name", {
                  required: "Please, complete all the fieldes",
                })}
                aria-invalid={errors.last_name ? "true" : "false"}
                {...(errors.last_name ? { error: true } : {})}
              />
            </div>
            <div className="mt-3 col-10">
              <Input
                variant="standard"
                label="Password*"
                placeholder="Password*"
                color="blue"
                type="password"
                {...register("password", {
                  required: "Please, complete all the fieldes",
                })}
                aria-invalid={errors.password ? "true" : "false"}
                {...(errors.password || errorPaswordCompatible
                  ? { error: true }
                  : {})}
                  
                onInput={(e)=>setErrorPasswordCompatible(false)}
              />
            </div>
            <div className="mt-3 col-10">
              <Input
                variant="standard"
                label="Repeat password*"
                placeholder="Repeat password*"
                color="blue"
                type="password"
                {...register("reppassword", {
                  required: "Please, complete all the fieldes",
                })}
                aria-invalid={errors.reppassword ? "true" : "false"}
                {...(errors.reppassword || errorPaswordCompatible
                  ? { error: true }
                  : {})}
                  
                onInput={(e)=>setErrorPasswordCompatible(false)}
              />
            </div>
            {(errors.password ||
              errors.name ||
              errors.reppassword ||
              errors.email ||
              errors.user_name ||
              errors.last_name) &&
              !errorPaswordCompatible && (
                <div className="mt-2 text-red-500">
                  Please, complete all the fieldes
                </div>
              )}
            {errorPaswordCompatible && (
              <div className="mt-2 text-red-500">The passwords don't match</div>
            )}
            {errorEmail && (
              <div className="mt-2 text-red-500">This email already exists</div>
            )}
            {errorUserName && (
              <div className="mt-2 text-red-500">This user name already exists</div>
            )}

            {!waiting ? (
              <Button
                variant="gradient"
                color="cyan"
                className="mt-4 px-4 text-[12.5px] py-2"
                onClick={handleSubmit(onSubmit)}
              >
                Sing up
              </Button>
            ) : (
              <Spinner color="cyan" className="mt-4 " />
            )}

            <div className="mt-4 col-10 text-center">
              Do you have an account?{" "}
              <Link
                to={"/login"}
                className="font-semibold hover:underline cursor-pointer"
              >
                Sing in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
