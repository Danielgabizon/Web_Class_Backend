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

//   // Register and login the user
//   const response1 = await request(app).post("/auth/register").send(user);
//   user._id = response1.body.data._id; // Save the user id
//   const response2 = await request(app).post("/auth/login").send(user);
//   user.accessToken = response2.body.data.accessToken; // Save the user token
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
//       post._id = response.body.data._id;
//     }
//   });

//   test("Create post fail", async () => {
//     // create post without content
//     const post = {
//       sender: new mongoose.Types.ObjectId(),
//       title: "Test title 1",
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
//     expect(response.body.data.length).toBe(3);
//     response.body.data.forEach((post: post) => {
//       expect(post.sender).toBe(user._id);
//     });
//   });

//   test("Test filter by title", async () => {
//     const first_post = testPost[0];
//     const response = await request(app).get(`/posts?title=${first_post.title}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data.length).toBe(1);
//     expect(response.body.data[0].title).toBe(first_post.title);
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

//   test("Test Delete post", async () => {
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

//   test("Test get post fail", async () => {
//     // Get post that does not exist
//     const response = await request(app).get(`/posts/${testPost[0]._id}`);
//     expect(response.statusCode).toBe(404);
//     expect(response.body.status).toBe("Error");
//   });
// });
