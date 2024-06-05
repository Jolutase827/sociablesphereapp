import React, { useState } from "react";
import logo from "./../../assets/Logo SocialSphere sin fondo.png";
import { Button, Input, Spinner, Switch, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
const Login = ({login}) => {
  const navigate = useNavigate();
  const [notFoundError,setNotFoundError] = useState(false);
  const [waiting,setWaiting] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = async (dataInput, e) => {
     setWaiting(true);
     await axios.post('https://apisociablesphere-production.up.railway.app/api/login',{login:dataInput.name,password:dataInput.password})
     .then(response=>{
        let user = JSON.stringify(response.data.user);
        if(dataInput.remember)
          localStorage.setItem('user',user);
        
        sessionStorage.setItem('user',user)
        login( JSON.parse(user));
        setNotFoundError(false);
        navigate("/user-interface/dashboard");
    })
     .catch(error=>setNotFoundError(true));
     setWaiting(false);
     
  };
  return (
    <main className=" col-12">
      <div className="d-flex col-12 flex-column flex-sm-row">
        <div className="h-[100vh] col-12 col-sm-6 p-4">
          <h1 className="logo-font h-[10%] text-[30px]">SociableSphere</h1>
          <form className="col-12 h-[80%] mt-5 d-flex justify-center items-center flex-col">
            <h2 className="col-11 mb-4 font-semibold text-[30px]">Log in</h2>
            <div className="col-10">
              <Input
                variant="standard"
                label="User name or email"
                placeholder="User name or email"
                color="blue"
                {...register("name", {
                  required: "Please, complete all the fieldes",
                })}
                aria-invalid={errors.name ? "true" : "false"}
                {...(errors.name||notFoundError? {error: true}:{})}
                onInput={(e)=>setNotFoundError(false)}
              />
            </div>
            <div className="mt-4 col-10">
              <Input
                variant="standard"
                label="Password"
                placeholder="Password"
                color="blue"
                type="password"
                {...register("password", {
                  required: "Please, complete all the fieldes",
                })}
                aria-invalid={errors.password ? "true" : "false"}
                {...(errors.password||notFoundError? {error: true}:{})}
                onInput={(e)=>setNotFoundError(false)}
              />
            </div>
            <div className="col-10 mt-4">
              <Switch
                ripple={false}
                {...register("remember")}
                label={
                  <div>
                    <Typography color="blue-gray" className="font-semibold">
                      Remember Me
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-medium"
                    >
                      <i className="bi bi-info-circle"></i>You&apos;ll be able
                      to login without password.
                    </Typography>
                  </div>
                }
                color="cyan"
              />
            </div>
            {((errors.password||errors.name)&&!notFoundError)&&
            <div className="mt-2 text-red-500">
                Please, complete all the fieldes
            </div>
            }
            {notFoundError&&
            <div className="mt-2 text-red-500">
                The identifier of the account or the password are incorrect
            </div>
            }
            {!waiting?<Button
              variant="gradient"
              color="cyan"
              className="mt-4 px-4 text-[12.5px] py-2"
              onClick={handleSubmit(onSubmit)}
            >
              Sing in
            </Button>
            :
            <Spinner color="cyan" className="mt-4 "/>}

            <div className="mt-4 col-10 text-center">
              Are you not registered on <span className="font-semibold text-cyan-800">SociableSphere</span> yet? {" "}
              <Link
                to={"/register"}
                className=" font-bold hover:underline cursor-pointer"
              >
                Sing up
              </Link>
            </div>
          </form>
        </div>
        <div className="h-[100vh]  col-12 col-sm-6   container-photo-login">
          <div className="col-12 h-[100%] flex justify-center items-center flex-col bg-blue-app-light">
            <img src={logo} alt="Logo" className="col-3" />

            <div className="mt-3  flex flex-col items-center text-color-dark-blue contenedor inicio">
              <h3 className="text-[40px] col-8 text-center font-semibold logo-font">
                Welcome another time!
              </h3>
              <h5 className="text-center mt-3 col-7 text-[25px] font-medium font-random">
                Earn money watching ads and you have the freedom to disable them
                whenever you want! Join now and make the most of your time
                online.
              </h5>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
