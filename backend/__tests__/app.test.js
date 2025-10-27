import app from "../index.js";
import request from "supertest";
import { expect, jest } from "@jest/globals";
import { isPasswordComplex, isUsernameComplex } from "../utils/validators.js";

jest.mock("../config/db.js", () => ({
  default: jest.fn(),
}));

// Unit test class
// Will have 5 unit tests here and 5 in the frontend folder
// npm test command is node --experimental-vm-modules node_modules/jest/bin/jest.js --forceExit
// other kept getting module errors
// backend tests
describe("Backend tests", () => {
  //testing password validator
  test("Test password validator", () => {
    const goodpassword = "GreatPassword1!";
    const badpassword = "badpassword";

    expect(isPasswordComplex(goodpassword)).toBe(true);
    expect(isPasswordComplex(badpassword)).toBe(false);
  });

  //testing username validator
  test("Test username validator", () => {
    const goodusername = "johncena1";
    const badusername = "112loll";

    expect(isUsernameComplex(goodusername)).toBe(true);
    expect(isUsernameComplex(badusername)).toBe(false);
  });

  // test / works, server working
  test("GET / rendering", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual("Hello registration");
  });

  //test so that without middleware you cant use /api/me

  test("/api/me, middleware testing", async () => {
    const response = await request(app).get("/api/me");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("No token provided");
  });

  test("test /api/courses/:courseid/users, user list in course", async () => {
    const response = await request(app).get("/api/courses/0244911/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Users grabbed successfully.");
  });
});
