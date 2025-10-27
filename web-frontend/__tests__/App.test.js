import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import { render, screen, fireEvent } from "@testing-library/react";
// Unit test class
// Will have 5 unit tests here and 5 in the backend folder

// front end tests
describe("Frontend component tests", () => {
  // testing that the app renders
  test("renders welcome text from startup", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome to Course Chat!/)).toBeInTheDocument();
  });

  // check functionality of login and signup pages
  test("Login and Sign up functionality", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Log In/));
    expect(screen.getByPlaceholderText(/Email/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Back/));
    fireEvent.click(screen.getByText(/Sign Up/));
    expect(screen.getByPlaceholderText(/username/)).toBeInTheDocument();
  });

  // missing username, invalid signup
  test("Invalid Sign up", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Sign Up/));
    fireEvent.change(screen.getByPlaceholderText(/Email/), {
      target: { value: "testing@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "testing password" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/), {
      target: { value: "testing password" },
    });
    fireEvent.click(screen.getByRole("button"));
    //expect to still be on sign up page since it shouldnt have worked
    expect(screen.getByPlaceholderText(/username/)).toBeInTheDocument();
  });

  //missing invalid login wrong credentials
  test("Invalid Log In", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Log In/));
    fireEvent.change(screen.getByPlaceholderText(/Email/), {
      target: { value: "wrongemail@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrong wrong password" },
    });
    fireEvent.click(screen.getByRole("button"));
    //expect to still be on log in page since it shouldnt have worked
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  // test password validation and toastify error message
  test("Sign Up Password Validation", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Sign Up/));
    fireEvent.change(screen.getByPlaceholderText(/username/), {
      target: { value: "blahblahblah" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/), {
      target: { value: "testing@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "testing password" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/), {
      target: { value: "testing password" },
    });
    fireEvent.click(screen.getByRole("button"));
    //await waitFor(() => expect(toast.warning).toHaveBeenCalled());
    //expect to still be on sign up page since it shouldnt have worked
    expect(screen.getByPlaceholderText(/username/)).toBeInTheDocument();
  });
});
