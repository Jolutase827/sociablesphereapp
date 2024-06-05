import React from "react";
import PostText from "./PostText";
import PostPhoto from "./PostPhoto";
import PostVideo from "./PostVideo";
const ObtainType = ({ post,user,login }) => {
  if (post.type.id === 1) {
    return <PostText post={post} />;
  } else if (post.type.id % 2 === 0) {
    return <PostPhoto post={post} user={user} login={login}/>;
  } else {
    return <PostVideo post={post} user={user} login={login} />;
  }
};

export default ObtainType;
