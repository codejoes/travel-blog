import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Axios from "axios";
import { Image } from "cloudinary-react";
import { ADD_POST } from "../../utils/mutations";
import { QUERY_POSTS } from "../../utils/queries";

import Auth from "../../utils/auth";

const PostForm = () => {
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [postUrl, setPostUrl] = useState("");

  const uploadImage = (files) => {
    const formData = new FormData();
    //console.log(files[0]);
    formData.append("file", files[0]);
    formData.append("upload_preset", "foeijptg");
    console.log(formData);
    Axios.post(
      "https://api.cloudinary.com/v1_1/dk4nuqa71/image/upload",
      formData
    ).then((res) => {
      //console.log(res);
      //console.log(res.data.secure_url);
      setPostUrl(res.data.secure_url);
      //files[0].image_url = res.data.publicId;
    });
  };

  const [addPost, { error }] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      try {
        const { posts } = cache.readQuery({ query: QUERY_POSTS });

        cache.writeQuery({
          query: QUERY_POSTS,
          data: { posts: [addPost, ...posts] },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    //console.log(postText);
    //console.log(postImage);
    try {
      const { data } = await addPost({
        variables: {
          postText,
          postImage: postUrl,
          postAuthor: Auth.getProfile().data.username,
        },
      });

      setPostText("");
      setPostImage("");
      setPostUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    // console.log(event.target);

    if (event.target.files) {
      console.log(event.target.files);
      setPostImage(URL.createObjectURL(event.target.files[0]));
      uploadImage(event.target.files);
    }

    const { name, value } = event.target;

    if (name === "postText" && value.length <= 560) {
      setPostText(value);
      setCharacterCount(value.length);
    }
  };

  return (
    <div>
      <h3>What have you been doing on your travels?</h3>

      {Auth.loggedIn() ? (
        <>
          <p
            className={`m-0 ${
              characterCount === 560 || error ? "text-danger" : ""
            }`}
          >
            Character Count: {characterCount}/560
          </p>
          <br />
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="flex-row justify-center">
              <label>
                <h5>Upload a photo to go with your post: </h5>
                <input
                  type="file"
                  id="blogPhoto"
                  name="blogPhoto"
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                />
              </label>

              <Image cloudName="dk4nuqa71" publicId={postUrl} />
            </div>
            <div className="col-12 col-lg-9">
              <textarea
                name="postText"
                placeholder="Here's a new post..."
                value={postText}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button
                className="btn btn-custom-taupe btn-block py-3"
                type="submit"
              >
                Create New Post
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to share your blog posts. Please{" "}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default PostForm;
