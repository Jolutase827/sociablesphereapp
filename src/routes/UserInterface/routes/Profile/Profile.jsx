import React, { useEffect, useState } from "react";
import getUserImage from "../../../../functions/helpers/UserImage";
import { Button } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../../../components/LoadingPage";
import Post from "../../../../components/Posts/Post";
import EditProfile from "./components/EditProfile";
import ShowFollowers from "./components/ShowFollowers";
import ShowFollows from "./components/ShowFollows";

const Profile = ({ user, login }) => {
  const [posts, setPosts] = useState([]);
  const [openFollowers, setOpenFollowers] = useState(false);
  const handleOpenFollowers = ()=>setOpenFollowers(!openFollowers);
  const [openFollows, setOpenFollows] = useState(false);
  const handleOpenFollows = ()=>setOpenFollows(!openFollows);
  const [userToShow, setUserToShow] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit(!openEdit);
  const { user_profile } = useParams();
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingMessage,setLoadingMessage] = useState(false);
  const [following, setFollowing] = useState(null);
  const navigate = useNavigate();
  const goToChat = async ()=>{
    setLoadingMessage(true);
    await axios.post("https://apisociablesphere-production.up.railway.app/api/chat",{user_id:userToShow.id},{
      headers: {
        Authorization: `Bearer ${user.api_token}`,
      }}).then(response=>{
        navigate("/user-interface/chats/chat/"+response.data.id);
      })
      setLoadingMessage(false);
  }




  const followUser = async () => {
    setLoadingFollow(true);
    await axios
      .post(
        "https://apisociablesphere-production.up.railway.app/api/follow",
        {
          user_followed_id: userToShow.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.api_token}`,
          },
        }
      )
      .then((response) => {
        const followAux = response.data;
        const userAux = structuredClone(userToShow);
        userAux.followers = [...userAux.followers,followAux];
        setUserToShow(userAux);
        setFollowing([followAux]);
      })
      .catch((error) => console.error(error));
    setLoadingFollow(false);
  };

  const unfollowUser = async () => {
    setLoadingFollow(true);
    await axios
      .delete("https://apisociablesphere-production.up.railway.app/api/follow/" + following[0].id, {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        const userAux = structuredClone(userToShow);
        userAux.followers = userAux.followers.filter((f)=>f.id!==following[0].id);
        setFollowing([]);
        setUserToShow(userAux);
      })
      .catch((error) => console.error(error));
    setLoadingFollow(false);
  };

  const searchUser = async () => {
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/users/" + user_profile, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        const userAux = response.data;
        setUserToShow(userAux); 
        setFollowing(userAux.followers.filter((f) => f.user_id === user.id));
        setPosts(userAux.posts);
      });
    setLoadingPage(false);
  };

  const deletePost = (post) => {
    setPosts(posts.filter((p1) => p1.id !== post.id));
  };
  
  useEffect(() => {
    searchUser();
  }, [user_profile]);

  return (
    <main
      className={`flex flex-col col-12 ${loadingPage ? "items-center" : ""}`}
    >
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <>
          <div className="flex py-5 px-20 justify-between">
            <div className="col-5 flex flex-col items-center">
              <img
                src={getUserImage(userToShow)}
                alt="User"
                className="w-[125px] h-[125px] rounded-full shadow-md"
              />
              <div className="font-bold text-[30px] text-black">
                @{userToShow.user_name}
              </div>
              <div className="font-semibold">
                {userToShow.name + " " + userToShow.last_name}
              </div>
              <div className="mt-2">{userToShow.description}</div>
            </div>
            <div className="col-7 flex flex-col items-center">
              <div className="flex justify-around col-12">
                <div className="flex flex-col items-center ">
                  <div className="font-bold text-[30px]">{posts.length}</div>
                  <div className="font-bold">Posts</div>
                </div>
                <div className="flex flex-col items-center text-gray-600 hover:text-gray-800 active:text-black cursor-pointer" onClick={handleOpenFollowers}>
                  <div className="font-bold text-[30px]">
                    {userToShow.followers.length}
                  </div>
                  <div className="font-bold">Followers</div>
                </div>
                <div className="flex flex-col items-center text-gray-600 hover:text-gray-800 active:text-black cursor-pointer" onClick={handleOpenFollows}>
                  <div className="font-bold text-[30px]">
                    {userToShow.followed.length}
                  </div>
                  <div className="font-bold">Follows</div>
                </div>
              </div>
              {user.id === userToShow.id ? (
                <Button
                  type="gradient"
                  color="cyan"
                  className="mt-4"
                  onClick={handleOpenEdit}
                >
                  Edit profile
                </Button>
              ) : (
                <div className="col-12 flex justify-center mt-4">
                  {following.length===0 ? (
                    <Button
                      variant="gradient"
                      color="blue"
                      className="mt-4"
                      onClick={followUser}
                      {...(loadingFollow ? { loading: true } : {})}
                    >
                      Follow
                    </Button>
                  ) : (
                    <Button
                      variant="gradient"
                      color="cyan"
                      className="mt-4"
                      onClick={unfollowUser}
                      {...(loadingFollow ? { loading: true } : {})}
                    >
                      Unfollow
                    </Button>
                  )}
                  <Button variant="text" className=" ms-4 mt-4" onClick={goToChat} {...(loadingMessage ? { loading: true } : {})}>
                    Send message
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="col-12 border-t-[0.25px]">
            {posts.length === 0 ? (
              <div className="col-12 text-center text-[30px] font-bold mt-5 mb-5">
                This user haven't posted anything yet
              </div>
            ) : (
              <>
                {posts.map((post, index) => (
                  <Post
                    post={post}
                    user={user}
                    index={index}
                    key={index}
                    deletePost={deletePost}
                  />
                ))}
              </>
            )}
          </div>
          <ShowFollowers openFollowers={openFollowers} handleOpenFollowers={handleOpenFollowers} userToShow={userToShow} setUserToShow={userToShow} />
          <ShowFollows  openFollows={openFollows} handleOpenFollows={handleOpenFollows} userToShow={userToShow} setUserToShow={userToShow}/>
        </>
      )}
      <EditProfile
        user={user}
        login={login}
        openEdit={openEdit}
        handleOpenEdit={handleOpenEdit}
        setUserToShow={setUserToShow}
      />
     
    </main>
  );
};

export default Profile;
