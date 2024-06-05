import React from 'react'

const PostText = ({post}) => {
  return (
    <div className="py-5 text-center text-[40px] font-random col-12 ">
          {post.content}
    </div>
  )
}

export default PostText