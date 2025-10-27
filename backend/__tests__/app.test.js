import app from "../index.js";
import request from "supertest";

// Unit test class
// Will have 5 unit tests here and 5 in the frontend folder

// backend tests
describe("Backend tests", () => {
  // test / works, server working
  test("GET / rendering", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual("Hello registration");
  });
});
