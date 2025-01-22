// import request from "supertest";
// import initApp from "../server";
// import mongoose from "mongoose";
// import postsModel, { IPost } from "../models/posts_model";
// import userModel, { IUser } from "../models/users_model";
// import { Express } from "express";

// let app: Express | null = null;

// interface user extends IUser {
//   _id?: string;
//   accessToken?: string;
// }
// interface post extends IPost {
//   _id?: string;
// }

// const user1: user = {
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

//   // Register and login the first user
//   const response1 = await request(app).post("/auth/register").send(user1);
//   user1._id = response1.body.data._id; // Save the user id
//   const response2 = await request(app).post("/auth/login").send(user1);
//   user1.accessToken = response2.body.data.accessToken; // Save the user token

//   // Register and login the second user
//   const response3 = await request(app).post("/auth/register").send(user2);
//   user2._id = response1.body.data._id; // Save the user id
//   const response4 = await request(app).post("/auth/login").send(user2);
//   user2.accessToken = response2.body.data.accessToken; // Save the user token

//   // Create the test post for the first user
//   await request(app)
//     .post("/posts")
//     .set({ authorization: "jwt " + user1.accessToken })
//     .send(testPost);
// });

// afterAll(() => {
//   console.log("After all tests");
//   mongoose.connection.close();
// });

// describe("Auth Tests", () => {
//   test("Get current logged-in user1", async () => {
//     const response = await request(app)
//       .get("/users/me")
//       .set({
//         authorization: "jwt " + user1.accessToken,
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data._id).toBe(user1._id);
//     expect(response.body.data.username).toBe(user1.username);
//     expect(response.body.data.email).toBe(user1.email);
//     expect(response.body.data.fname).toBe(user1.fname);
//     expect(response.body.data.lname).toBe(user1.lname);
//   });
//   test("Get current logged-in user1's posts ", async () => {
//     const response = await request(app)
//       .get("/users/me/posts")
//       .set({
//         authorization: "jwt " + user1.accessToken,
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data.length).toBe(1);
//     expect(response.body.data[0].sender).toBe(user1._id);
//     expect(response.body.data[0].title).toBe(testPost.title);
//     expect(response.body.data[0].content).toBe(testPost.content);
//   });

//   test("Update username - fail ", async () => {
//     // Try to update the username with existing username
//     const response = await request(app)
//       .put("/users/me")
//       .set({ authorization: "jwt " + user1.accessToken })
//       .send({ username: user2.username });
//     expect(response.statusCode).not.toBe(200);
//     expect(response.body.status).toBe("Error");
//   });

//   test("Update username - success ", async () => {
//     const response = await request(app)
//       .put("/users/me")
//       .set({ authorization: "jwt " + user1.accessToken })
//       .send({ username: "newusername" });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data.username).toBe("newusername");
//     user1.username = "newusername"; // Save the new username
//   });

//   test("Delete username - sucess", async () => {
//     const response = await request(app)
//       .delete("/users/me")
//       .set({ authorization: "jwt " + user1.accessToken });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Success");
//   });
// });
