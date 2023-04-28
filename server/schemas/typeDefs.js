const { gql } = require("apollo-server-express");
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

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    posts: [Post]!
  }

  type Post {
    _id: ID
    postText: String
    postAuthor: String
    createdAt: String
    comments: [Comment]!
  }

  type Comment {
    _id: ID
    commentText: String
    commentAuthor: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type File {
    id: ID
    filename: String!
    mimetype: String!
    path: String!
  }

  scalar Upload

  type Query {
    users: [User]
    user(username: String!): User
    posts(username: String): [Post]
    post(postId: ID!): Post
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addPost(postText: String!, postAuthor: String!): Post
    addComment(postId: ID!, commentText: String!, commentAuthor: String!): Post
    removePost(postId: ID!): Post
    removeComment(postId: ID!, commentId: ID!): Post
    updatePost(postId: ID!, postText: String!): Post
    uploadFile(file: Upload!): File
  }
`;

module.exports = typeDefs;
