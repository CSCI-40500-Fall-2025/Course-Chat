import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

jest.mock("./src/contexts/AuthContext", () => ({
    useAuth: () => ({
      registerUser: jest.fn(() => Promise.resolve()),
      loginUser: jest.fn(() => Promise.resolve()),
    }),
}));


  