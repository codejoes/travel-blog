import React from "react";

// Import the `useParams()` hook
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import DeletePost from "../components/DeletePost";
//import UpdatePostForm from "../components/UpdatePostForm";

import { QUERY_SINGLE_POST } from "../utils/queries";

const SinglePost = () => {
  // Use `useParams()` to retrieve value of the route parameter `:profileId`
  const { postId } = useParams();

  const { loading, data } = useQuery(QUERY_SINGLE_POST, {
    // pass URL parameter
    variables: { postId: postId },
  });

  const post = data?.post || {};

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-3">
      <h3 className="card-header bg-custom-raisin text-custom-pink p-2 m-0">
        {post.postAuthor} <br />
        <span style={{ fontSize: "1rem" }}>
          created this post on {post.createdAt}
        </span>
      </h3>
      <div className="bg-custom-lion py-4">
        <div className="display-flex justify-center">
          <img className="blogPhoto" src={post.postImage} />
        </div>

        <blockquote
          className="p-4"
          style={{
            fontSize: "1.5rem",
            fontStyle: "italic",
            border: "2px dotted #1a1a1a",
            lineHeight: "1.5",
            overflowWrap: "break-word",
          }}
        >
          {post.postText}
        </blockquote>
        <div className="display-flex justify-space-around no-dec">
          <DeletePost postId={post._id} />
          <Link className="btn btn-lg btn-info " to={`/posts/${post._id}/edit`}>
            {" "}
            📝
          </Link>
        </div>
      </div>

      <div className="my-5">
        <CommentList comments={post.comments} />
      </div>
      <div className="m-3 p-4" style={{ border: "1px dotted #1a1a1a" }}>
        <CommentForm postId={post._id} />
      </div>
    </div>
  );
};

export default SinglePost;
