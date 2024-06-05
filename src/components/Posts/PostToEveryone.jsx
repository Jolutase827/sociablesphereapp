import React, { useEffect, useState } from "react";
import getUserImage from "../../functions/helpers/UserImage";
import { Button, Textarea } from "@material-tailwind/react";
import ObtainType from "./ObtainType";
import { useForm } from "react-hook-form";
import axios from "axios";
import Comment from "../Comment";
import { useNavigate } from "react-router-dom";

const PostToEveryone = ({
  post,
  index,
  user,
  handleOpenDelete,
  suggested,
  add,
  login,
}) => {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes);
  const [claims, setClaims] = useState(add ? post.claims : []);
  const [isClaimed, setIsClaimed] = useState(
    add ? post.claims.find((claim) => claim.user_id === user.id) : false
  );
  const [loadingClaimed, setLoadingClaimed] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes.find((like) => like.user_id === user.id)
  );
  const [myLike, setMyLike] = useState(
    post.likes.find((like) => like.user_id === user.id)
  );
  const [loadingCreateComment, setLoadingCreateComment] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const deleteComents = (comment) => {
    setComments(comments.filter((c1) => c1.id !== comment.id));
  };
  useEffect(() => {
    setLikes(post.likes);
    setIsLiked(post.likes.find((like) => like.user_id === user.id));
    setComments(post.comments);
  }, [post]);
  const createClaim = async () => {
    setLoadingClaimed(true);
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/claim/" + post.id, {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        setClaims([...claims, response.data]);
        setIsClaimed(true);
      })
      .catch((error) => console.error(error));
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/wallet/" + 0.25, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        const userAux = response.data;
        if (localStorage.getItem("user") !== null&&localStorage.getItem("user") !== undefined)
          localStorage.setItem("user", JSON.stringify(userAux));
        sessionStorage.setItem("user", JSON.stringify(userAux));
        login(userAux);
      })
      .catch((error) => alert(error.message));
    setLoadingClaimed(false);
  };
  const createLike = () => {
    setIsLiked(true);
    axios
      .post(
        "https://apisociablesphere-production.up.railway.app/api/like",
        { post_id: post.id },
        {
          headers: {
            Authorization: `Bearer ${user.api_token}`,
          },
        }
      )
      .then((response) => {
        setMyLike(response.data);
        setLikes([...likes, response.data]);
      })
      .catch((error) => console.error(error));
  };

  const deleteLike = () => {
    setIsLiked(false);
    axios
      .delete("https://apisociablesphere-production.up.railway.app/api/like/" + myLike.id, {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        setLikes(likes.filter((l1) => l1.id !== myLike.id));
        setMyLike(null);
      })
      .catch((error) => console.error(error));
  };

  const navigateToUserProfile = () => {
    navigate("/user-interface/profile/" + post.user.id);
  };

  const date = new Date(post.created_at);
  const comment = async (dataInput, e) => {
    if (dataInput.text !== "") {
      setLoadingCreateComment(true);
      await axios
        .post(
          "https://apisociablesphere-production.up.railway.app/api/comments",
          { post_id: post.id, text: dataInput.text },
          {
            headers: {
              Authorization: `Bearer ${user.api_token}`,
            },
          }
        )
        .then((response) => {
          setComments([response.data, ...comments]);
          setValue("text", "");
        })
        .catch((error) => console.log(error));
      setLoadingCreateComment(false);
    }
  };
  return (
    <div
      className={` col-12 col-md-7 py-3   ${
        index % 2 !== 0 ? "bg-white" : "bg-gray-100"
      }`}
    >
      {suggested && !add && (
        <div className="flex items-center text-gray-500 pb-2 px-4">
          Suggested
        </div>
      )}
      {add && (
        <div className="flex items-center text-gray-500 pb-2 px-4">
          Advertisement
        </div>
      )}
      <div className="flex justify-between items-center border-b-[1px] border-gray-400 py-2 px-4">
        <div className="flex items-center">
          <img
            src={getUserImage(post.user)}
            alt="User"
            className="w-[60px] h-[60px] rounded-full cursor-pointer"
            onClick={navigateToUserProfile}
          />
          <div className="ms-2 cursor-pointer" onClick={navigateToUserProfile}>
            <div className="font-semibold">@{post.user.user_name}</div>
            <div className="ms-2 text-[10px]">{post.user.name}</div>
            <div className="text-[10px] ms-2 text-black">
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
        {user.id === post.user_id && (
          <div>
            <div className="dropdown">
              <div
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Button variant="text" color="black">
                  <i className="bi bi-three-dots-vertical text-[20px]"></i>
                </Button>
              </div>
              <ul className="dropdown-menu p-1">
                <li>
                  <div
                    className="dropdown-item cursor-pointer"
                    onClick={handleOpenDelete}
                  >
                    Delete post
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="col-12">
        <ObtainType post={post} login={login} user={user}/>
        <div className="flex p-2 items-center px-4">
          {isLiked ? (
            <Button
              variant="text"
              className="rounded-full p-2"
              onClick={deleteLike}
            >
              <i className="bi bi-heart-fill text-red-500 text-[30px]"></i>
            </Button>
          ) : (
            <Button
              variant="text"
              className="rounded-full p-2"
              onClick={createLike}
            >
              <i className="bi bi-heart text-[30px]"></i>
            </Button>
          )}

          <div className="font-semibold">{likes.length} Likes</div>
          {add ? (
            isClaimed ? (
              <i className="text-gray-600 ms-3">Claimed</i>
            ) : (
              <Button
                variant="gradient"
                color="green"
                className="p-2 ms-3"
                onClick={createClaim}
                {...(loadingClaimed ? { loading: true } : {})}
              >
                <i className="bi bi-wallet text-[30px]"></i>
              </Button>
            )
          ) : (
            <></>
          )}
        </div>
        <div className="p-2 px-4">
          <h4 className="font-semibold text-[20px]">
            Comments ({comments.length})
          </h4>
          <div className="col-12 mt-2">
            {comments.length > 0 ? (
              <>
                {comments.map((comment, index) => (
                  <Comment
                    comment={comment}
                    key={index}
                    post={post}
                    deleteComents={deleteComents}
                    user={user}
                  />
                ))}
              </>
            ) : (
              <div className="text-center text-[12.5px] text-gray-400">
                No comments yet
              </div>
            )}
            <form
              onSubmit={handleSubmit(comment)}
              className="flex w-full flex-row items-center gap-2 rounded-[99px] border border-gray-900/10 bg-gray-900/5 p-2 mt-2"
            >
              <Textarea
                rows={1}
                resize={true}
                placeholder="Your Message"
                className="min-h-full !border-0 focus:border-transparent"
                containerProps={{
                  className: "grid h-full",
                }}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                {...register("text")}
              />
              <div>
                <Button
                  variant="gradient"
                  color="blue"
                  type="submit"
                  className="rounded-full"
                  {...(loadingCreateComment ? { loading: true } : {})}
                >
                  <i className="bi bi-send text-[25px]"></i>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostToEveryone;
