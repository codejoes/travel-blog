import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import UpdatePostForm from "../components/UpdatePostForm";

import { QUERY_SINGLE_POST } from "../utils/queries";

const Update = () => {
  const { postId } = useParams();

  const { loading, data } = useQuery(QUERY_SINGLE_POST, {
    variables: { postId: postId },
  });

  const post = data?.post || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UpdatePostForm postId={post._id} />
    </div>
  );
};

export default Update;
