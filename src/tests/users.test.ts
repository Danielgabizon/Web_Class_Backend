// import request from "supertest";
// import initApp from "../server";
// import mongoose from "mongoose";
// import postsModel, { IPost } from "../models/posts_model";
// import userModel, { IUser } from "../models/users_model";
// import { Express } from "express";

// let app: Express | null = null;

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
//   password: "1234567",
//   email: "username2@gmail.com",
//   fname: "fname2",
//   lname: "lname2",
// };

// // Define the test post
// const testPost: post = {
//   sender: new mongoose.Types.ObjectId(), // Dummy user id
//   title: "Test title 1",
//   content: "Test content 1",
// };

// beforeAll(async () => {
//   console.log("Before all tests");
//   app = await initApp();
//   await userModel.deleteMany();
//   await postsModel.deleteMany();

//   // Register and login the user
//   const response1 = await request(app).post("/auth/register").send(user);
//   user._id = response1.body.data._id; // Save the user id
//   const response2 = await request(app).post("/auth/login").send(user);
//   user.accessToken = response2.body.data.accessToken; // Save the user token

//   // Create the test post for the user
//   const response = await request(app)
//     .post("/posts")
//     .set({ authorization: "jwt " + user.accessToken })
//     .send(testPost);
//   testPost._id = response.body.data._id; // Save the post id
//   testPost.sender = response.body.data.sender; // Save the sender id
// });

// afterAll(() => {
//   console.log("After all tests");
//   mongoose.connection.close();
// });

// describe("Auth Tests", () => {
//   test("Get current logged-in user details", async () => {
//     const response = await request(app)
//       .get("/users/" + user._id)
//       .set({
//         authorization: "jwt " + user.accessToken,
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data._id).toBe(user._id);
//     expect(response.body.data.username).toBe(user.username);
//     expect(response.body.data.email).toBe(user.email);
//     expect(response.body.data.fname).toBe(user.fname);
//     expect(response.body.data.lname).toBe(user.lname);
//   });
//   test("Get current logged-in user1's posts ", async () => {
//     // query the posts of the user
//     const response = await request(app).get(`/posts?sender=${user._id}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data.length).toBe(1);
//   });

//   test("Update username - fail ", async () => {
//     // Try to update the username with existing username
//     // Register user2
//     const response3 = await request(app).post("/auth/register").send(user2);

//     const response = await request(app)
//       .put("/users/" + user._id)
//       .set({ authorization: "jwt " + user.accessToken })
//       .send({ username: user2.username });
//     expect(response.statusCode).not.toBe(200);
//     expect(response.body.status).toBe("Error");
//   });

//   test("Update username - success ", async () => {
//     user.username = "newusername";
//     const response = await request(app)
//       .put("/users/" + user._id)
//       .set({ authorization: "jwt " + user.accessToken })
//       .send(user);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data.username).toBe("newusername");
//   });
// });
