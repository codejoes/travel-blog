import React from "react";
import { useQuery } from "@apollo/client";

import PostList from "../components/PostList";
import PostForm from "../components/PostForm";

import { QUERY_POSTS } from "../utils/queries";
import { ThreeCircles } from "react-loader-spinner";

const Home = () => {
  const { loading, data } = useQuery(QUERY_POSTS);
  const posts = data?.posts || [];

  return (
    <main>
      <div className="flex-row justify-center bg-custom-pink rounded">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          //style={{ border: "1px dotted #1a1a1a" }}
        >
          <PostForm />
        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>
              Loading...
              <ThreeCircles
                height="100"
                width="100"
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="three-circles-rotating"
                outerCircleColor=""
                innerCircleColor=""
                middleCircleColor=""
              />
            </div>
          ) : (
            <PostList
              posts={posts}
              title="Let's see what you've been up to..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
