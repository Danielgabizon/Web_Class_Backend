import { Express } from "express";
import request from 'supertest';
import mongoose from "mongoose";
import initApp from "../server";
 import userModel, { IUser } from "../models/users_model";
 import commentsModel, { IComment } from "../models/comments_model";
let app: Express;
interface comment extends IComment {
  _id?: string;
}
interface user extends IUser {
  _id?: string;
  accessToken?: string;
}
var post1id = new mongoose.Types.ObjectId();
var post2id = new mongoose.Types.ObjectId();
const testComment: comment[] = [
  {
    sender: new mongoose.Types.ObjectId(),
    postid: post1id,
    content: "Test content 1",
  },
  {
    sender: new mongoose.Types.ObjectId(),
    postid: post2id,
    content: "Test content 2",
  },
  {
    sender: new mongoose.Types.ObjectId(),
    postid: post1id,
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
    
        //Register and login the user
       const response1 = await request(app).post("/auth/register").send(user);
       user._id = response1.body.data._id;  //Save the user id
       const response2 = await request(app).post("/auth/login").send(user);
       user.accessToken = response2.body.data.accessToken;  //Save the user token
  });
  
afterAll(() => {
    console.log("After all tests");
    mongoose.connection.close();
});
  describe("Comments test", () => {
    test("Get all comments", async () => {
      const response = await request(app).get("/comments");
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.data.length).toBe(0);
    });

    test("create comments", async () => {
      for (const comment of testComment) {
        const response = await request(app).post("/comments/"+comment.postid)
        .set({
          authorization: "jwt " + user.accessToken,
        })
        .send(comment);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("Success");
        expect(response.body.data.postid).toBe(comment.postid.toString());
        expect(response.body.data.content).toBe(comment.content);
        comment._id = response.body.data._id;
      }
    });
      test("Create comment fail", async () => {
        const comment = {
          sender: new mongoose.Types.ObjectId(),
          postid: new mongoose.Types.ObjectId(),
        };
        const response = await request(app).post("/comments/"+comment.postid)
        .set({
          authorization: "jwt " + user.accessToken,
        }).send(comment);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("Error");
      });
    test("Get all comments", async () => {
      const response = await request(app).get("/comments");
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.data.length).toBe(testComment.length);
    });
    test("Get all comments by post1", async () => {
      const response = await request(app).get("/comments/post/"+post1id);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.data.length).toBe(testComment.filter((c) => c.postid.toString() === post1id.toString()).length);
    });
    test("Get all comments by post2", async () => {
      const response = await request(app).get("/comments/post/"+post2id);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.data.length).toBe(testComment.filter((c) => c.postid.toString() === post2id.toString()).length);
    });
    test("Test filter by sender", async () => {
      const comment = testComment[0];
      const response = await request(app).get(`/comments?sender=${user._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.data.length).toBe(3);
      expect(response.body.data[0].sender).toBe(user._id.toString());
    });
    test("Get comment by id", async () => {
      const comment = testComment[0];
      const response = await request(app).get(`/comments/${comment._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.data._id).toBe(comment._id);
      expect(response.body.data.sender).toBe(user._id.toString());
      expect(response.body.data.content).toBe(comment.content);
    });

    test("Test Delete comment", async () => {
      const comment = testComment[0];
      const response = await request(app).delete(`/comments/${comment._id}`).set({ authorization: "jwt " + user.accessToken });;
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      const response2 = await request(app).get(`/comments/${comment._id}`);
      expect(response2.statusCode).toBe(404);
      expect(response2.body.status).toBe("Error");
    });
    test("Get comment by id fail", async () => {
      const response = await request(app).get(`/comments/${testComment[0]._id}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("Error");
    });
  });
