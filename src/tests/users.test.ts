import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import usersModel, { IUser } from "../models/users_model";
import { Express } from "express";
let app: Express;
interface user extends IUser {
  _id?: string;
}
const testUsers: user[] = [
  {
    username: "test1",
    email: "email1@gmail.com",
    password: "password1",
    fname: "fname1",
    lname: "lname1",
  },
  {
    username: "test2",
    email: "email2@gmail.com",
    password: "password2",
    fname: "fname2",
    lname: "lname2",
  },
];
beforeAll(async () => {
  console.log("Before all tests");
  app = await initApp();
  await usersModel.deleteMany();
});

afterAll(() => {
  console.log("After all tests");
  mongoose.connection.close();
});

describe("Users test", () => {
  test("Create user", async () => {
    for (const user of testUsers) {
      const response = await request(app).post("/users").send(user);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.data.username).toBe(user.username);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.password).toBe(user.password);
      expect(response.body.data.fname).toBe(user.fname);
      expect(response.body.data.lname).toBe(user.lname);
      user._id = response.body.data._id;
    }
  });
  test("Create user fail", async () => {
    const post = {
      username: "test1",
      email: "dsdsd@gmail.com",
    };
    const response = await request(app).post("/users").send(post);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Error");
  });
  test("Get all users", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.data.length).toBe(testUsers.length);
  });
  test("Test filter by username", async () => {
    const user = testUsers[0];
    const response = await request(app).get(`/users?username=${user.username}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].username).toBe(user.username);
  });
  test("Test filter by email", async () => {
    const user = testUsers[0];
    const response = await request(app).get(`/users?email=${user.email}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].email).toBe(user.email);
  });
  test("Get user by id", async () => {
    const user = testUsers[0];
    const response = await request(app).get(`/users/${user._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.data._id).toBe(user._id);
    expect(response.body.data.username).toBe(user.username);
    expect(response.body.data.email).toBe(user.email);
    expect(response.body.data.password).toBe(user.password);
    expect(response.body.data.fname).toBe(user.fname);
    expect(response.body.data.lname).toBe(user.lname);
  });

  test("Test Delete user", async () => {
    const user = testUsers[0];
    const response = await request(app).delete(`/users/${user._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    const response2 = await request(app).get(`/users/${user._id}`);
    expect(response2.statusCode).toBe(404);
    expect(response2.body.status).toBe("Error");
  });
  test("Get user by id fail", async () => {
    const response = await request(app).get(`/users/${testUsers[0]._id}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Error");
  });
});
