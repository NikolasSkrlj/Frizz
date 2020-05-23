const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { userOne, userOneId, setupDb } = require("./fixtures/db");

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "jsjd@gmail.com",
      password: "jsjasdj",
    })
    .expect(400);
});
