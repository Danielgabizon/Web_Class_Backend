// import { Express } from "express";
// import request from "supertest";
// import mongoose from "mongoose";
// import initApp from "../server";
// import userModel, { IUser } from "../models/users_model";
// import postModel, { IPost } from "../models/posts_model";
// import commentsModel, { IComment } from "../models/comments_model";
// let app: Express;
// interface comment extends IComment {
//   _id?: string;
// }
// interface post extends IPost {
//   _id?: string;
// }
// interface user extends IUser {
//   _id?: string;
//   accessToken?: string;
// }
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
// ];
// // Define the test comments
// const testComment: comment[] = [
//   {
//     sender: new mongoose.Types.ObjectId(),
//     postId: new mongoose.Types.ObjectId(),
//     content: "Test content 1",
//   },
//   {
//     sender: new mongoose.Types.ObjectId(),
//     postId: new mongoose.Types.ObjectId(),
//     content: "Test content 2",
//   },
//   {
//     sender: new mongoose.Types.ObjectId(),
//     postId: new mongoose.Types.ObjectId(),
//     content: "Test content 3",
//   },
// ];
// //Define the user object
// const user: user = {
//   username: "username1",
//   password: "123456",
//   email: "username1@gmail.com",
//   fname: "fname1",
//   lname: "lname1",
// };
// beforeAll(async () => {
//   console.log("Before all tests");
//   app = await initApp();
//   await commentsModel.deleteMany();
//   await userModel.deleteMany();
//   await postModel.deleteMany();
//   //Register and login the user
//   const response1 = await request(app).post("/auth/register").send(user);
//   user._id = response1.body.data._id; //Save the user id
//   const response2 = await request(app).post("/auth/login").send(user);
//   user.accessToken = response2.body.data.accessToken; // Save the user accesstoken
//   // Create posts
//   const response3 = await request(app)
//     .post("/posts")
//     .set({ authorization: "jwt " + user.accessToken })
//     .send(testPost[0]);
//   const response4 = await request(app)
//     .post("/posts")
//     .set({ authorization: "jwt " + user.accessToken })
//     .send(testPost[1]);
//   // Save the post ids
//   testPost[0]._id = response3.body.data._id;
//   testPost[1]._id = response4.body.data._id;
//   // attach post ids to the comments
//   testComment[0].postId = response3.body.data._id; // Attach the first comment to the first post
//   testComment[1].postId = response4.body.data._id; // Attach the second comment to the second post
//   testComment[2].postId = response3.body.data._id; // Attach the third comment to the first post
// });
// afterAll(() => {
//   console.log("After all tests");
//   mongoose.connection.close();
// });
// test("create comments", async () => {
//   for (const comment of testComment) {
//     const response = await request(app)
//       .post("/comments/" + comment.postId)
//       .set({
//         authorization: "jwt " + user.accessToken,
//       })
//       .send(comment);
//     expect(response.statusCode).toBe(201);
//     expect(response.body.status).toBe("Success");
//     expect(response.body.data.postId).toBe(comment.postId.toString());
//     expect(response.body.data.sender).toBe(user._id);
//     expect(response.body.data.content).toBe(comment.content);
//     comment._id = response.body.data._id;
//     comment.sender = response.body.data.sender;
//   }
// });
// test("Create comment fail", async () => {
//   // Create a comment with invalid post id
//   const comment = {
//     sender: user._id,
//     postId: new mongoose.Types.ObjectId(),
//   };
//   const response = await request(app)
//     .post("/comments/" + comment.postId)
//     .set({
//       authorization: "jwt " + user.accessToken,
//     })
//     .send(comment);
//   expect(response.statusCode).toBe(404);
//   expect(response.body.status).toBe("Error");
// });
// test("Create comment fail", async () => {
//   // Create an empty comment for the first post
//   const comment = {
//     sender: new mongoose.Types.ObjectId(),
//     postId: testPost[0]._id,
//   };
//   const response = await request(app)
//     .post("/comments/" + comment.postId)
//     .set({
//       authorization: "jwt " + user.accessToken,
//     })
//     .send(comment);
//   expect(response.statusCode).toBe(400);
//   expect(response.body.status).toBe("Error");
// });
// test("Get All comments", async () => {
//   const response = await request(app).get("/comments");
//   expect(response.statusCode).toBe(200);
//   expect(response.body.status).toBe("Success");
//   expect(response.body.data.length).toBe(3);
// });
// test("Get all post1 comments", async () => {
//   const response = await request(app).get(
//     "/comments/?postId=" + testPost[0]._id
//   );
//   expect(response.statusCode).toBe(200);
//   expect(response.body.status).toBe("Success");
//   expect(response.body.data.length).toBe(2);
// });
// test("Get all post2 comments", async () => {
//   const response = await request(app).get(
//     "/comments/?postId=" + testPost[1]._id
//   );
//   expect(response.statusCode).toBe(200);
//   expect(response.body.status).toBe("Success");
//   expect(response.body.data.length).toBe(1);
// });
// test("Get comment by Id", async () => {
//   const response = await request(app).get(`/comments/${testComment[0]._id}`);
//   expect(response.statusCode).toBe(200);
//   expect(response.body.status).toBe("Success");
//   expect(response.body.data._id).toBe(testComment[0]._id);
//   expect(response.body.data.postId).toBe(testComment[0].postId.toString());
//   expect(response.body.data.sender).toBe(user._id);
//   expect(response.body.data.content).toBe(testComment[0].content);
// });
// test("Update comment", async () => {
//   testComment[0].content = "Updated content";
//   const response = await request(app)
//     .put(`/comments/${testComment[0]._id}`)
//     .set({ authorization: "jwt " + user.accessToken })
//     .send(testComment[0]);
//   expect(response.statusCode).toBe(200);
//   expect(response.body.status).toBe("Success");
//   expect(response.body.data.content).toBe(testComment[0].content);
// });
// test("Test Delete comment", async () => {
//   const comment = testComment[0];
//   const response = await request(app)
//     .delete(`/comments/${comment._id}`)
//     .set({ authorization: "jwt " + user.accessToken });
//   expect(response.statusCode).toBe(200);
//   expect(response.body.status).toBe("Success");
// });
// test("Delete comment by id fail", async () => {
//   // Delete a comment with invalid id
//   const response = await request(app)
//     .delete(`/comments/${testComment[0]._id}`)
//     .set({ authorization: "jwt " + user.accessToken });
//   expect(response.statusCode).toBe(404);
//   expect(response.body.status).toBe("Error");
// });
//# sourceMappingURL=comments.test.js.map