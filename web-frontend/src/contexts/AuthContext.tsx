import React, { createContext, useState, useEffect, useContext } from "react";
import { type UserProfile } from "../models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    await registerAPI(username, email, password)
      .then((res) => {
        if (res) {
          console.log(res.data);
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            username: res?.data.user.username,
            email: res?.data.user.email,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Registration Successful!");
          navigate("/dashboard");
        }
      })
      .catch((e) =>
        toast.warning(e.message || "Error occurred. Please try again.")
      );
  };
  const loginUser = async (email: string, password: string) => {
    await loginAPI(email, password)
      .then((res) => {
        if (res) {
          console.log(res.data);
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            username: res?.data.user.username,
            email: res?.data.user.email,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login Successful!");
          navigate("/dashboard");
        }
      })
      .catch((e) =>
        toast.warning(e.message || "Error occurred. Please try again.")
      );
  };
  const isLoggedIn = () => {
    return !!user;
  };
  const logout = () => {
    toast.success("Logout successfull");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
  };
  return (
    <AuthContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
    >
      {isReady ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
