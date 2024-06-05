import React, { useState } from "react";
import getPostImage from "../../functions/helpers/PostImages";
import axios from "axios";
import { Spinner } from "@material-tailwind/react";
import DialogNotEnoughtMoney from "./DialogNotEnoughtMoney";

const PostPhoto = ({ post, user, login }) => {
  const [payments, setPayments] = useState(
    post.type.has_cost ? post.payments : []
  );
  const [isPayed, setIsPayed] = useState(
    post.user_id === user.id
      ? true
      : post.type.has_cost
      ? post.payments.find((payment) => payment.user_id === user.id)
      : true
  );
  const [loading, setLoading] = useState(false);
  const [openText, setOpenText] = useState(false);
  const handleOpenText = () => {
    setOpenText(!openText);
  };
  const paid = async () => {
    setLoading(true);
    if (user.wallet >= post.cost) {
      await axios
        .get("https://apisociablesphere-production.up.railway.app/api/payment/" + post.id, {
          headers: {
            Authorization: `Bearer ${user.api_token}`,
          },
        })
        .then((response) => {
          setPayments([...payments, response.data]);
          setIsPayed(true);
        })
        .catch((error) => console.error(error));
      await axios
        .get("https://apisociablesphere-production.up.railway.app/api/wallet/-" + post.cost, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.api_token}`,
          },
        })
        .then((response) => {
          const userAux = response.data;
          if (
            localStorage.getItem("user") !== null &&
            localStorage.getItem("user") !== undefined
          )
            localStorage.setItem("user", JSON.stringify(userAux));
          sessionStorage.setItem("user", JSON.stringify(userAux));
          login(userAux);
        })
        .catch((error) => alert(error.message));
      await axios
        .get("https://apisociablesphere-production.up.railway.app/api/wallet/" + post.cost, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${post.user.api_token}`,
          },
        })
        .then((response) => {})
        .catch((error) => alert(error.message));
    } else {
      handleOpenText();
    }
    setLoading(false);
  };
  return (
    <>
      {isPayed ? (
        <div className="col-12">
          <img src={getPostImage(post)} alt="Post" className="col-12" />
          <div className="flex col-12 mt-2 px-4">
            <div className="font-semibold ms-2 ">{post.user.user_name}:</div>
            <div className="ms-1">{post.footer}</div>
          </div>
        </div>
      ) : (
        <div className="col-12 h-[300px] bg-black flex flex-col justify-center items-center">
          <div className="text-[40px] text-white font-semibold">
            This post is sponsored
          </div>
          {loading ? (
            <Spinner color="white" className="mt-5 h-12 w-12 mb-5" />
          ) : (
            <div
              className="text-[20px] hover:text-gray-300 cursor-pointer text-gray-400 font-semibold underline"
              onClick={()=>paid()}
            >
              Pay {post.cost}€ to see
            </div>
          )}
        </div>
      )}
      <DialogNotEnoughtMoney openText={openText} handleOpenText={handleOpenText} />
    </>
  );
};

export default PostPhoto;
