import React from "react";
import { Link } from "react-router-dom";

const PostList = ({ posts, title }) => {
  if (!posts.length) {
    return <h3>No Blog Posts Yet</h3>;
  }

  return (
    <div>
      <h3>{title}</h3>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="card mb-3">
            <h4 className="card-header bg-custom-raisin text-custom-pink p-2 m-0">
              {post.postAuthor} <br />
              <span style={{ fontSize: "1rem" }}>
                created this post on {post.createdAt}
              </span>
            </h4>
            <div className="card-body bg-custom-lion p-2">
              <div className="display-flex justify-center">
                <img className="homeImage" src={post.postImage} />
              </div>
              <div className="post-text-padding">
                <p className="overflow-wrap">{post.postText}</p>
              </div>
            </div>
            <Link
              className="btn btn-primary btn-block btn-squared"
              to={`/posts/${post._id}`}
            >
              Join the discussion on this blog post.
            </Link>
          </div>
        ))}
    </div>
  );
};

export default PostList;
