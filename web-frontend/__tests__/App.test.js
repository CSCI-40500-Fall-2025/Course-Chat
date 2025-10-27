import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import { render, screen, fireEvent } from "@testing-library/react";
// Unit test class
// Will have 5 unit tests here and 5 in the backend folder
describe("Frontend component tests", () => {
  test("renders welcome text from startup", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome to Course Chat!/)).toBeInTheDocument();
  });
});
