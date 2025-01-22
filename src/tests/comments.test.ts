import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import initApp from "../server";
import userModel, { IUser } from "../models/users_model";
import postModel, { IPost } from "../models/posts_model";
import commentsModel, { IComment } from "../models/comments_model";
let app: Express;
interface comment extends IComment {
  _id?: string;
}
interface post extends IPost {
  _id?: string;
}
interface user extends IUser {
  _id?: string;
  accessToken?: string;
}
let post1id: string;
let post2id: string;
const testPost: post[] = [
  {
    sender: new mongoose.Types.ObjectId(), // Dummy user id
    title: "Test title 1",
    content: "Test content 1",
  },
  {
    sender: new mongoose.Types.ObjectId(), // Dummy user id
    title: "Test title 2",
    content: "Test content 2",
  },
];
const testComment: comment[] = [
  {
    sender: new mongoose.Types.ObjectId(),
    postId: new mongoose.Types.ObjectId(),
    content: "Test content 1",
  },
  {
    sender: new mongoose.Types.ObjectId(),
    postId: new mongoose.Types.ObjectId(),
    content: "Test content 2",
  },
  {
    sender: new mongoose.Types.ObjectId(),
    postId: new mongoose.Types.ObjectId(),
    content: "Test content 3",
  },
];
//Define the user object
const user: user = {
  username: "username1",
  password: "123456",
  email: "username1@gmail.com",
  fname: "fname1",
  lname: "lname1",
};
beforeAll(async () => {
  console.log("Before all tests");
  app = await initApp();
  await commentsModel.deleteMany();
  await userModel.deleteMany();
  await postModel.deleteMany();

  //Register and login the user
  const response1 = await request(app).post("/auth/register").send(user);
  user._id = response1.body.data._id; //Save the user id
  const response2 = await request(app).post("/auth/login").send(user);
  user.accessToken = response2.body.data.accessToken; //Save the user token
  const response3 = await request(app)
    .post("/posts")
    .set({ authorization: "jwt " + user.accessToken })
    .send(testPost[0]);
  const response4 = await request(app)
    .post("/posts")
    .set({ authorization: "jwt " + user.accessToken })
    .send(testPost[1]);
  testComment[0].postId = response3.body.data._id;
  testComment[1].postId = response4.body.data._id;
  testComment[2].postId = response3.body.data._id;
  post1id = response3.body.data._id;
  post2id = response4.body.data._id;
});

afterAll(() => {
  console.log("After all tests");
  mongoose.connection.close();
});
describe("Comments test", () => {
  test("create comments", async () => {
    for (const comment of testComment) {
      const response = await request(app)
        .post("/posts/" + comment.postId + "/comments")
        .set({
          authorization: "jwt " + user.accessToken,
        })
        .send(comment);
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("Success");
      expect(response.body.data.postId).toBe(comment.postId.toString());
      expect(response.body.data.content).toBe(comment.content);
      comment._id = response.body.data._id;
    }
  });
  test("Create comment fail", async () => {
    const comment = {
      sender: new mongoose.Types.ObjectId(),
      postId: new mongoose.Types.ObjectId(),
    };
    const response = await request(app)
      .post("/posts/" + comment.postId + "/comments")
      .set({
        authorization: "jwt " + user.accessToken,
      })
      .send(comment);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Error");
  });
  test("Get all comments by post1", async () => {
    const response = await request(app).get("/posts/" + post1id + "/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.data.length).toBe(
      testComment.filter((c) => c.postId.toString() === post1id.toString())
        .length
    );
  });
  test("Get all comments by post2", async () => {
    const response = await request(app).get("/posts/" + post2id + "/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.data.length).toBe(
      testComment.filter((c) => c.postId.toString() === post2id.toString())
        .length
    );
  });
  test("Test filter by sender", async () => {
    const comment = testComment[0];
    const response = await request(app).get(
      `/posts/${comment.postId}/comments?sender=${user._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].sender).toBe(user._id.toString());
  });
  test("Update comment fail", async () => {
    const comment = testComment[0];
    comment.content = "Updated content";
    const response = await request(app)
      .put(`/posts/${comment.postId}/comments/${comment._id}`)
      .set({ authorization: "jwt " + user.accessToken });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Error");
  });

  test("Test Delete comment", async () => {
    const comment = testComment[0];
    const response = await request(app)
      .delete(`/posts/${comment.postId}/comments/${comment._id}`)
      .set({ authorization: "jwt " + user.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
  });
  test("Delete comment by id fail", async () => {
    const response = await request(app)
      .delete(`/posts/${testComment[0].postId}/comments/${testComment[0]._id}`)
      .set({ authorization: "jwt " + user.accessToken });
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Error");
  });
});
