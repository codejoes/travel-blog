import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UPDATE_POST } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { QUERY_POSTS, QUERY_SINGLE_POST } from "../../utils/queries";

// const UpdatePostForm = () => {
//   const [postText, setPostText] = useState("");

//   const [characterCount, setCharacterCount] = useState(0);

//   const [updatePost, { error, loading, data }] = useMutation(UPDATE_POST, {
//     update(cache, { data: { updatePost } }) {
//       try {
//         const posts = cache.readQuery({ query: QUERY_SINGLE_POST });

//         cache.writeQuery({
//           query: QUERY_SINGLE_POST,
//           data: { posts: [updatePost, ...posts] },
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     },
//   });

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const { data } = await updatePost({
//         variables: {
//           postId: data.postId,
//           postText,
//         },
//       });
//       setPostText("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     if (name === "postText" && value.lenght <= 280) {
//       setPostText(value);
//       setCharacterCount(value.length);
//     }
//   };

// const UpdatePostForm = ({ postId }) => {
//   const [postText, setPostText] = useState("");

//   const [updatePost, { error, loading, data }] = useMutation(UPDATE_POST, {
//     refetchQueries: [
//       { query: QUERY_SINGLE_POST, query: QUERY_POSTS },
//       "getSinglePost",
//       "getPosts",
//     ],
//   });

//   const handleUpdate = async (event) => {
//     event.preventDefault();

//     try {
//       const { data } = await updatePost({
//         variables: {
//           postId,
//           postText: data.postText,
//         },
//       });
//       console.log("post updated!");
//     } catch (err) {
//       console.error(err);
//     }

//     return (
//       <div>
//         {Auth.loggedIn() ? (
//           <form onSubmit={handleUpdate}>
//             <input
//               type="text"
//               placeholder="Update post here..."
//               value={postText}
//             ></input>
//           </form>
//         ) : (
//           <p>
//             You need to be logged in to edit blog posts:
//             <Link to="/login">Login</Link> <Link to="signup">Signup</Link>
//           </p>
//         )}
//         <button className="btn btn-info btn-block" type="submit">
//           📝
//         </button>
//       </div>
//     );
//   };
// };

const UpdatePostForm = ({ postId }) => {
  const [postText, setPostText] = useState("");
  let navigate = useNavigate();
  const [characterCount, setCharacterCount] = useState(0);

  const [updatePost, { error }] = useMutation(UPDATE_POST, {
    update(cache, { data: { updatePost } }) {
      try {
        const { post } = cache.readQuery({ query: QUERY_SINGLE_POST });

        cache.writeQuery({
          query: QUERY_SINGLE_POST,
          data: { post: [updatePost, post] },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    console.log(postText);
    try {
      const { data } = await updatePost({
        variables: {
          postId,
          postText,
        },
      });

      setPostText("");
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "postText" && value.length <= 280) {
      setPostText(value);
      setCharacterCount(value.length);
    }
  };

  return (
    <div>
      <h3>What updates do you have?</h3>

      {Auth.loggedIn() ? (
        <>
          <p
            className={`m-0 ${
              characterCount === 280 || error ? "text-danger" : ""
            }`}
          >
            Character Count: {characterCount}/280
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <textarea
                name="postText"
                placeholder="Update your post here..."
                value={postText}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Update
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
          You need to be logged in to update your blog posts. Please{" "}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default UpdatePostForm;
