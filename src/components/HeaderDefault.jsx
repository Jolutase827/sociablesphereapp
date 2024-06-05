import React, { useEffect, useState } from "react";
import getUserImage from "../functions/helpers/UserImage";
import { useNavigate } from "react-router-dom";
import { Switch } from "@material-tailwind/react";

const HeaderDefault = ({ user , logout,activeDesactiveAdds,activeAdds }) => {
  const navigate = useNavigate();
  const goToSearch = () => {
    navigate("/user-interface/search");
    setLocationH("search");
  };
  const goToDashboard = () => {
    navigate("/user-interface/dashboard");
    setLocationH("dashboard");
  };
  const goToCreatePost = () => {
    navigate("/user-interface/create-post");
    setLocationH("create-post");
  };
  const gotToChats = () => {
    navigate("/user-interface/chats");
    setLocationH("chats");
  };
  const goToProfile = () => {
    navigate("/user-interface/profile/" + user.id);
    setLocationH("profile");
  };
  const goToWallet = () => {
    navigate("/user-interface/wallet");
    setLocationH("wallet");
  };
  const [locationH, setLocationH] = useState(
    window.location.href.split("/")[4]
  );

  useEffect(() => {
    setLocationH(window.location.href.split("/")[4]);
  }, [window.location.href]);

  return (
    <header className="h-[100px] border-b-[1px] border-gray flex items-center justify-between shadow-md">
      <h1 className="logo-font ms-4 text-[30px] col-2 col-md-5">
        SociableSphere
      </h1>
      <div className=" col-6 flex items-center justify-around">
        <div
          className={`flex items-center cursor-pointer hover:text-[gray] transition hover:transition ${
            locationH === "dashboard" ? "text-cyan-600" : ""
          }`}
          onClick={goToDashboard}
        >
          <i className="bi bi-house-door-fill text-[25px]"></i>
          <div className="mt-[3px] ms-1 d-none d-xl-flex  font-semibold">
            Home
          </div>
        </div>
        <div
          className={`flex items-center cursor-pointer hover:text-[gray] transition hover:transition ${
            locationH === "create-post" ? "text-cyan-600" : ""
          }`}
          onClick={goToCreatePost}
        >
          <i className="bi bi-plus-square mt-[1px] text-[25px]"></i>
          <div className="mt-[3px] d-none d-xl-flex  ms-1 font-semibold ">
            New Post
          </div>
        </div>
        <div
          className={`flex items-center cursor-pointer hover:text-[gray] transition hover:transition ${
            locationH === "search" ? "text-cyan-600" : ""
          }`}
          onClick={goToSearch}
        >
          <i className="bi bi-search text-[25px]"></i>
          <div className="mt-[3px] d-none d-xl-flex  ms-1 font-semibold ">
            Search
          </div>
        </div>
        <div
          className={`flex items-center cursor-pointer hover:text-[gray] transition hover:transition ${
            locationH === "chats" ? "text-cyan-600" : ""
          }`}
          onClick={gotToChats}
        >
          <i className="bi bi-chat-dots-fill text-[25px]"></i>
          <div className="mt-[3px] ms-1 d-none d-xl-flex  font-semibold">
            Messages
          </div>
        </div>
        <div
          className={`flex items-center cursor-pointer hover:text-[gray] transition hover:transition ${
            locationH === "profile" ? "text-cyan-600" : ""
          }`}
          onClick={goToProfile}
        >
          <img
            src={getUserImage(user)}
            alt="Profile"
            className={`w-[30px] h-[30px] rounded-full ${
              locationH === "profile" ? "shadow-lg" : "shadow-sm"
            }`}
          />
          <div className=" ms-1 d-none d-xl-flex  font-semibold">Profile</div>
        </div>
        <div className="dropdown">
          <button
            className="flex items-center cursor-pointer hover:text-[gray] transition hover:transition me-4"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-gear-fill  text-[25px]"></i>
          <div className="me-1 d-none d-xl-flex font-semibold">Settings</div>
          </button>
          <ul className="dropdown-menu">
            <li>
              <div className="dropdown-item cursor-pointer" onClick={logout}>
                Logout
              </div>
              {user.role==='normal'&&<div className="dropdown-item cursor-pointer flex" >
                <Switch label="Activate adds" ripple={false} checked={activeAdds} onChange={activeDesactiveAdds}/>
              </div>}
            </li>
          </ul>
        </div>
        <div
          className={`flex items-center cursor-pointer hover:text-[gray] transition hover:transition me-4 ${
            locationH === "wallet" ? "text-green-600" : ""
          }`}
          onClick={goToWallet}
        >
          <div className="me-1 font-semibold">{user.wallet}€</div>
          <i className="bi bi-cash-stack text-[25px]"></i>
        </div>
      </div>
    </header>
  );
};

export default HeaderDefault;
