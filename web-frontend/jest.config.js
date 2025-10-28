export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest", // use Babel for JSX/TSX
  },
  moduleNameMapper: {
    // mock CSS and style imports
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // handle image and asset imports
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
};
