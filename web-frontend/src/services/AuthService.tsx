import axios from "axios";
import { type UserProfileToken } from "../models/User";
import { handleError } from "../helpers/ErrorHandler";

const api = "http://localhost:5001/api"; //change with env later

export const loginAPI = async (email: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "/login", {
      email: email,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "/signup", {
      username: username,
      email: email,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};
