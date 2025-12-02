import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

jest.mock("./src/contexts/AuthContext", () => ({
    useAuth: () => ({
      registerUser: jest.fn(() => Promise.resolve()),
      loginUser: jest.fn(() => Promise.resolve()),
    }),
}));

// mock the failed tests in __tests__
jest.mock('./src/services/AuthService', () => ({
  loginAPI: jest.fn(() => Promise.reject({ response: { status: 401 } })),
  registerAPI: jest.fn(() => Promise.reject({ response: { status: 400 } })),
}));

jest.mock('./src/config/config', () => ({
  getAPIBaseURL: () => 'http://localhost:5001/api',
}));

// mock window.matchmedia function in themecontext since jest not working
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: true,
    media: query,
  })),
});