import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REMOVE_POST } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { QUERY_POSTS, QUERY_SINGLE_POST } from "../../utils/queries";

const DeletePost = ({ postId }) => {
  const [removePost, { error, loading, data }] = useMutation(REMOVE_POST, {
    refetchQueries: [
      { query: QUERY_SINGLE_POST, query: QUERY_POSTS },
      "getSinglePost",
      "getPosts",
    ],
  });

  let navigate = useNavigate();

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      const { data } = await removePost({
        variables: {
          postId,
        },
      });
      console.log("post deleted!");

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-row">
      {Auth.loggedIn() ? (
        <>
          <button onClick={handleDelete} className="btn btn-lg btn-danger">
            🗑️
          </button>
        </>
      ) : (
        <button className="btn btn-lg btn-info">
          <Link to="/login">Login</Link>
        </button>
      )}
    </div>
  );
};

export default DeletePost;
