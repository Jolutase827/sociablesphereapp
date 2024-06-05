import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DialogText from "./components/DialogText";
import DialogImage from "./components/DialogImage";
import axios from "axios";
import LoadingPage from "../../../../components/LoadingPage";
import Post from "../../../../components/Posts/Post";
import { Button } from "@material-tailwind/react";
import { set } from "react-hook-form";

const Dashboard = ({ user, login, activeAdds }) => {
  const navigate = useNavigate();
  const { nuevo } = useParams();
  const [posts, setPosts] = useState({ postFollowed: [], postOthers: [] });
  const [loading, setLoading] = useState(true);
  const [openText, setOpenText] = React.useState(nuevo ? true : false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [noMorePost, setNoMorePost] = useState(false);
  const [adds, setAdds] = useState([]);
  const handleOpenImage = () => {
    setOpenImage(!openImage);
    navigate("/user-interface/dashboard");
  };
  const handleOpenText = () => {
    setOpenText(!openText);
    setOpenImage(!openImage);
  };
  const getPosts = async () => {
    setLoading(true);
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/posts_with_algorithm", {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then(async (response) => {
        if (
          response.data.postFollowed.length === 0 &&
          response.data.postOthers.length === 0
        )
          setNoMorePost(true);
        await getAdds(response.data);
      })
      .catch((error) => console.error(error));
    setLoading(false);
  };

  const getMorePosts = async () => {
    setLoadingMore(true);
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/posts_with_algorithm", {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        if (response.data.postOthers.length === 0) {
          setNoMorePost(true);
        }
        setPosts({
          postFollowed: posts.postFollowed,
          postOthers: [...posts.postOthers, ...response.data.postOthers],
        });
      })
      .catch((error) => console.error(error));
    setLoadingMore(false);
  };
  const getAdds = async (data) => {
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/adds", {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        const postsAux = { postFollowed: [], postOthers: [] };
        const adds = response.data;
        data.postFollowed.forEach((element, index) => {
          if ((index + 1) % 2 === 0 && adds.length > 0 && activeAdds) {
            postsAux.postFollowed.push(adds.pop());
          }
          postsAux.postFollowed.push(element);
        });
        data.postOthers.forEach((element, index) => {
          if ((index + 1) % 2 === 0 && adds.length > 0 && activeAdds) {
            postsAux.postOthers.push(adds.pop());
          }
          postsAux.postOthers.push(element);
        });
        setPosts(postsAux);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (nuevo === undefined) getPosts();
  }, [window.location.href]);
  return (
    <div>
      <div className="col-12 flex items-center flex-col mt-1 min-h-[70vh]">
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {posts.postFollowed.map((post, index) => (
              <Post
                post={post}
                user={user}
                index={index}
                key={index}
                suggested={false}
                login={login}
                {...(post.type.has_reward ? { add: true } : {})}
              />
            ))}
            {posts.postOthers.map((post, index) => (
              <Post
                post={post}
                user={user}
                index={index + 1}
                key={index}
                suggested={true}
                login={login}
                {...(post.type.has_reward ? { add: true } : {})}
              />
            ))}
          </>
        )}
        {!noMorePost ? (
          <Button
            variant="gradient"
            color="white"
            className="mt-3 flex items-center"
            onClick={getMorePosts}
            {...(loadingMore ? { loading: true } : {})}
          >
            <i className="bi bi-arrow-clockwise text-[30px]"></i>
          </Button>
        ) : (
          <div className="mt-1 text-center text-[15px] font-semibold text-gray-600">
            You've seen all posts
          </div>
        )}
      </div>
      <DialogText
        handleOpenText={handleOpenText}
        openText={openText}
        user={user}
        login={login}
      />
      <DialogImage
        handleOpenImage={handleOpenImage}
        openImage={openImage}
        user={user}
        login={login}
      />
    </div>
  );
};

export default Dashboard;
