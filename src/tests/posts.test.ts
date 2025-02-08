// import request from "supertest";
// import initApp from "../server";
// import mongoose from "mongoose";
// import postsModel, { IPost } from "../models/posts_model";
// import userModel, { IUser } from "../models/users_model";
// import { Express } from "express";
// let app: Express;

// // Define the user and post interfaces

// interface user extends IUser {
//   _id?: string;
//   accessToken?: string;
// }

// interface post extends IPost {
//   _id?: string;
// }

// // Define the user object

// const user: user = {
//   username: "username1",
//   password: "123456",
//   email: "username1@gmail.com",
//   fname: "fname1",
//   lname: "lname1",
// };

// const user2: user = {
//   username: "username2",
//   password: "123456",
//   email: "username2@gmail.com",
//   fname: "fname2",
//   lname: "lname2",
// };

// // Define the test posts

// const testPost: post[] = [
//   {
//     sender: new mongoose.Types.ObjectId(), // Dummy user id
//     title: "Test title 1",
//     content: "Test content 1",
//   },
//   {
//     sender: new mongoose.Types.ObjectId(), // Dummy user id
//     title: "Test title 2",
//     content: "Test content 2",
//   },
//   {
//     sender: new mongoose.Types.ObjectId(), // Dummy user id
//     title: "Test title 3",
//     content: "Test content 3",
//   },
// ];

// beforeAll(async () => {
//   console.log("Before all tests");
//   app = await initApp();
//   await postsModel.deleteMany();
//   await userModel.deleteMany();

//   // Register and login the first user
//   const response1 = await request(app).post("/auth/register").send(user);
//   user._id = response1.body.data._id; // Save the user id
//   const response2 = await request(app).post("/auth/login").send(user);
//   user.accessToken = response2.body.data.accessToken; // Save the user token

//   // Register and login the second user
//   const response3 = await request(app).post("/auth/register").send(user2);
//   user2._id = response3.body.data._id; // Save the user id
//   const response4 = await request(app).post("/auth/login").send(user2);
//   user2.accessToken = response4.body.data.accessToken; // Save the user token
// });

// afterAll(() => {
//   console.log("After all tests");
//   mongoose.connection.close();
// });

// describe("Posts test", () => {
//   test("Create post", async () => {
//     // Create posts
//     for (const post of testPost) {
//       const response = await request(app)
//         .post("/posts")
//         .set({
//           authorization: "jwt " + user.accessToken,
//         })
//         .send(post);
//       expect(response.statusCode).toBe(201);
//       expect(response.body.status).toBe("Success");
//       expect(response.body.data.sender).toBe(user._id);
//       expect(response.body.data.title).toBe(post.title);
//       expect(response.body.data.content).toBe(post.content);
//       // Update our local copy
//       post._id = response.body.data._id;
//       post.sender = response.body.data.sender;
//     }
//   });

//   test("Create post fail 1 ", async () => {
//     // create post with empty content
//     const post = {
//       sender: user._id,
//       title: "Test title 1",
//       content: "",
//     };
//     const response = await request(app)
//       .post("/posts")
//       .set({
//         authorization: "jwt " + user.accessToken,
//       })
//       .send(post);
//     expect(response.statusCode).toBe(400);
//     expect(response.body.status).toBe("Error");
//   });

//   test("Create post fail 2 ", async () => {
//     // create post with empty title
//     const post = {
//       sender: user._id,
//       title: "",
//       content: "Test content 1",
//     };
//     const response = await request(app)
//       .post("/posts")
//       .set({
//         authorization: "jwt " + user.accessToken,
//       })
//       .send(post);
//     expect(response.statusCode).toBe(400);
//     expect(response.body.status).toBe("Error");
//   });
//   test("Get all posts", async () => {
//     const response = await request(app).get("/posts");
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data.length).toBe(testPost.length);
//   });

//   test("Test filter by sender", async () => {
//     const response = await request(app).get(`/posts?sender=${user._id}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data.length).toBe(testPost.length);
//   });

//   test("Update post fail", async () => {
//     // Update post from user that is not the sender
//     const post = testPost[0];
//     const response = await request(app)
//       .put(`/posts/${post._id}`)
//       .set({ authorization: "jwt " + user2.accessToken })
//       .send({
//         title: "Updated title",
//         content: "Updated content",
//       });
//     expect(response.statusCode).toBe(403);
//     expect(response.body.status).toBe("Error");
//   });

//   test("Update post - success", async () => {
//     testPost[0].title = "Updated title";
//     testPost[0].content = "Updated content";
//     const response = await request(app)
//       .put(`/posts/${testPost[0]._id}`)
//       .set({ authorization: "jwt " + user.accessToken })
//       .send(testPost[0]);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data.sender).toBe(user._id);
//     expect(response.body.data.title).toBe(testPost[0].title);
//     expect(response.body.data.content).toBe(testPost[0].content);
//   });

//   test("Get post by id", async () => {
//     const post = testPost[0];
//     const response = await request(app).get(`/posts/${post._id}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data._id).toBe(post._id);
//     expect(response.body.data.sender).toBe(user._id);
//     expect(response.body.data.title).toBe(post.title);
//     expect(response.body.data.content).toBe(post.content);
//   });

//   test("Test Delete post - fail", async () => {
//     // Delete post from user that is not the sender
//     const post = testPost[0];
//     const response = await request(app)
//       .delete(`/posts/${post._id}`)
//       .set({ authorization: "jwt " + user2.accessToken });
//     expect(response.statusCode).toBe(403);
//     expect(response.body.status).toBe("Error");
//   });

//   test("Test Delete post - success ", async () => {
//     const post = testPost[0];
//     const response = await request(app)
//       .delete(`/posts/${post._id}`)
//       .set({ authorization: "jwt " + user.accessToken });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     const response2 = await request(app).get(`/posts/${post._id}`);
//     expect(response2.statusCode).toBe(404);
//     expect(response2.body.status).toBe("Error");
//   });

//   test("Test get post - fail", async () => {
//     // Get post that does not exist
//     const response = await request(app).get(`/posts/${testPost[0]._id}`);
//     expect(response.statusCode).toBe(404);
//     expect(response.body.status).toBe("Error");
//   });
// });
