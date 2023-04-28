const { AuthenticationError } = require("apollo-server-express");
const { User, Post } = require("../models");
const { signToken } = require("../utils/auth");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require("graphql-upload");
const { finished } = require("stream/promises");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");

// const storeUpload = async ({ stream, filename }) => {
//   const uploadDir = "./uploads";
//   const path = join(uploadDir, filename);
//   return new Promise((resolve, reject) =>
//     stream
//       .pipe(createWriteStream(path))
//       .on("finish", () => resolve({ path }))
//       .on("error", reject)
//   );
// };

// const processUpload = async (upload) => {
//   const { createReadStream, filename, mimetype } = await upload;
//   const stream = createReadStream();
//   const { path } = await storeUpload({ stream, filename });
//   return { filename, mimetype, path };
// };

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    users: async () => {
      return User.find().populate("posts");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("posts");
    },
    posts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Post.find(params).sort({ createdAt: -1 });
    },
    post: async (parent, { postId }) => {
      return Post.findOne({ _id: postId });
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addPost: async (parent, { postText, postAuthor }) => {
      console.log(postText);
      const post = await Post.create({ postText, postAuthor });
      console.log(post);
      await User.findOneAndUpdate(
        { username: postAuthor },
        { $addToSet: { posts: post._id } }
      );

      return post;
    },
    addComment: async (parent, { postId, commentText, commentAuthor }) => {
      return Post.findOneAndUpdate(
        { _id: postId },
        {
          $addToSet: { comments: { commentText, commentAuthor } },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },
    removePost: async (parent, { postId }) => {
      return Post.findOneAndDelete({ _id: postId });
    },
    removeComment: async (parent, { postId, commentId }) => {
      return Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );
    },
    updatePost: async (parent, { postId, postText }) => {
      return Post.findOneAndUpdate(
        { _id: postId },
        {
          postText: postText,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },
    uploadFile: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();
      const out = require("fs").createWriteStream("./uploads");
      stream.pipe(out);
      await finished(out);

      // const result = await processUpload(file);
      // const newFile = await File.create(result);
      // return newFile;
      return { filename, mimetype, encoding };
    },
  },
};

module.exports = resolvers;
