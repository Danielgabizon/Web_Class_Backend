import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import usersModel, { IUser } from "../models/users_model";

let app: Express | null = null;

beforeAll(async () => {
  console.log("Before all tests");
  app = await initApp();
  await usersModel.deleteMany();
});

afterAll(() => {
  console.log("After all tests");
  mongoose.connection.close();
});

interface user extends IUser {
  _id?: string;
  accessToken?: string;
}

const user: user = {
  username: "username1",
  password: "123456",
  email: "username1@gmail.com",
  fname: "fname1",
  lname: "lname1",
};

describe("Auth Tests", () => {
  test("Auth Registration fail - missing field", async () => {
    Object.keys(user).forEach(async (field) => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          ...user,
          [field]: undefined,
        });
      expect(response.statusCode).not.toBe(200);
      expect(response.body.status).toBe("Error");
    });
  });

  test("Auth Registration - success ", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("Success");
  });

  test("Auth Registration fail - existing username", async () => {
    const response = await request(app).post("/auth/register").send({
      username: user.username,
      password: "111111",
      email: "differentemail@gmail.com",
      fname: "differentfname",
      lname: "differentlname",
    });
    expect(response.statusCode).not.toBe(200);
    expect(response.body.status).toBe("Error");
  });

  test("Auth Registration fail - existing email", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "differentusername",
      password: "111111",
      email: user.email,
      fname: "differentfname",
      lname: "differentlname",
    });
    expect(response.statusCode).not.toBe(200);
    expect(response.body.status).toBe("Error");
  });

  test("Auth Login fail - missing field", async () => {
    const response1 = await request(app).post("/auth/login").send({
      username: user.username,
      password: undefined,
    });
    expect(response1.statusCode).not.toBe(200);
    expect(response1.body.status).toBe("Error");
    const response2 = await request(app).post("/auth/login").send({
      username: undefined,
      password: user.password,
    });
    expect(response2.statusCode).not.toBe(200);
    expect(response2.body.status).toBe("Error");
  });
  test("Auth Login fail - wrong password", async () => {
    const response = await request(app).post("/auth/login").send({
      username: user.username,
      password: "wrongpassword",
    });
    expect(response.statusCode).not.toBe(200);
    expect(response.body.status).toBe("Error");
  });

  test("Auth Login - Success", async () => {
    const response = await request(app).post("/auth/login").send({
      username: user.username,
      password: user.password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");

    // Save the tokens for later use
    const accessToken = response.body.data.accessToken;
    const refreshToken = response.body.data.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    user.refreshTokens = [];
    user.accessToken = accessToken;
    user.refreshTokens.push(refreshToken);

    // Save the user id for later use
    const userId = response.body.data._id;
    expect(userId).toBeDefined();
    user._id = userId;
  });

  test("Auth different device login", async () => {
    const response = await request(app).post("/auth/login").send({
      username: user.username,
      password: user.password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");

    // Make sure the new acccess token is different from the previous one
    const accessToken = response.body.data.accessToken;
    expect(accessToken).toBeDefined();
    expect(accessToken).not.toBe(user.accessToken);

    // Make sure the new refresh token is different from the previous one
    const refreshToken = response.body.data.refreshToken;
    expect(refreshToken).toBeDefined();
    expect(refreshToken).not.toBe(user.refreshTokens[0]);
    user.refreshTokens.push(refreshToken); // add the new refresh for later use
  });
  test("Auth logut of second device - success", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set({
        authorization: "jwt " + user.refreshTokens[1],
      });
    user.refreshTokens.pop(); // remove the second refresh token (of the second device)
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
  });

  test("Add new post with protected API - success", async () => {
    const response2 = await request(app)
      .post("/posts")
      .set({
        authorization: "jwt " + user.accessToken,
      })
      .send({
        title: "Title",
        content: "Content",
      });
    expect(response2.statusCode).toBe(201);
    expect(response2.body.status).toBe("Success");
    expect(response2.body.data.sender).toBe(user._id); // Check if the sender is the same as the logged in user
  });

  test("Add new post with protected API - fail", async () => {
    const response2 = await request(app)
      .post("/posts")
      .set({
        authorization: "jwt " + user.accessToken + "1", // Use invalid access token
      })
      .send({
        sender: user._id,
        title: "Title",
        content: "Content",
      });
    expect(response2.statusCode).not.toBe(200);
    expect(response2.body.status).toBe("Error");
  });
  test("Refresh token", async () => {
    // generate new refresh token using old refresh token - should pass
    const response = await request(app)
      .post("/auth/refresh")
      .set({
        authorization: "jwt " + user.refreshTokens[0],
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    // generate new refresh toke Using old refresh token again - should fail
    const response1 = await request(app)
      .post("/auth/refresh")
      .set({
        authorization: "jwt " + user.refreshTokens[0],
      });
    expect(response1.statusCode).not.toBe(200);
    expect(response1.body.status).toBe("Error");
    // now we should login again because the refresh token was invalidated
    const response2 = await request(app).post("/auth/login").send({
      username: user.username,
      password: user.password,
    });
    expect(response2.statusCode).toBe(200);
    expect(response2.body.status).toBe("Success");
    user.refreshTokens = [response2.body.data.refreshToken]; // save the new refresh token
  });

  test("Logout", async () => {
    // Logout using refresh token - should pass
    const response = await request(app)
      .post("/auth/logout")
      .set({
        authorization: "jwt " + user.refreshTokens[0],
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    // Try to use the refresh token again
    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: user.refreshTokens[0],
    });
    expect(response2.statusCode).not.toBe(200);
    expect(response2.body.status).toBe("Error");
    user.refreshTokens = []; // clear the refresh tokens
  });
});
