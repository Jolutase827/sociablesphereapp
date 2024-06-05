import React, { useState } from "react";
import getUserImage from "../functions/helpers/UserImage";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Comment = ({ comment, post, deleteComents,user }) => {
  const navigate = useNavigate();


  const navigateToUserProfile = ()=>{
    navigate("/user-interface/profile/"+post.user.id);
  };
  const date = new Date(comment.created_at);
  const [loadingDeleteComment, setLoadingDeleteComment] = useState(false);
  const apiDeleteComment = async () => {
    setLoadingDeleteComment(true);
    await axios.delete("https://apisociablesphere-production.up.railway.app/api/comments/"+comment.id,{
            headers: {
              Authorization: `Bearer ${user.api_token}`,
            },
          }).then(response=>{
            deleteComents(comment);
          }).catch(error=>console.error(error));
    setLoadingDeleteComment(false);
  };
  return (
    <div className="flex justify-between items-center border-b-[1px] border-gray-400 pb-2 pt-2 ">
      <div className="flex items-center">
        <img
          src={getUserImage(comment.user)}
          alt="User"
          className="w-[30px] h-[30px] rounded-full cursor-pointer"
          onClick={navigateToUserProfile}
        />
        <div className="flex flex-col justify-center">
          <div className="flex">
            <div className="ms-2 cursor-pointer" onClick={navigateToUserProfile}>
              <div className="font-semibold">@{comment.user.user_name}</div>
            </div>
            <div>: {comment.text}</div>
          </div>
          <div className="ms-3 text-[12px]">
            Posted at{" "}
            {date.getDate() +
              "/" +
              date.getMonth() +
              "/" +
              date.getFullYear() +
              "-" +
              date.getHours() +
              ":" +
              date.getMinutes()}
          </div>
        </div>
      </div>
      {user.id===comment.user_id&&<div className="dropdown">
        <div type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <Button variant="text" color="black" {...(loadingDeleteComment? {loading: true}:{})}>
            <i className="bi bi-three-dots-vertical text-[20px]"></i>
          </Button>
        </div>
        <ul className="dropdown-menu p-1">
          <li>
            <div
              className="dropdown-item cursor-pointer"
              onClick={apiDeleteComment}
            >
              Delete comment
            </div>
          </li>
        </ul>
      </div>}
    </div>
  );
};

export default Comment;
