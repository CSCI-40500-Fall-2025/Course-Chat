import React, { createContext, useState, useEffect } from "react";
import { type UserProfile } from "../models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../services/AuthService";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

type JWTPayload = {
  exp: number;
  iat?: number;
  [key: string]: any;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const now = Date.now() / 1000;
    if (!decoded.exp) {
      console.log("TOKEN HAS NO EXPIRATION FIELD");
      return true;
    }
    return decoded.exp < now;
  } catch (err) {
    console.error("Invalid token", err);
    return true;
  }
};

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      if (isTokenExpired(token)) {
        console.log("EXPIRED TOKEN: LOGGING OUT");
        logout();
      } else {
        setUser(JSON.parse(user));
        setToken(token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        const now = Date.now();
        if (!decoded.exp) {
          console.log("TOKEN HAS NO EXPIRATION FIELD");
          logout();
        } else {
          const expireTime = decoded.exp * 1000 - now;
          if (expireTime > 0) {
            const timer = setTimeout(() => {
              toast.info("Session expired. Please log in again.");
              logout();
            }, expireTime);
            return () => clearTimeout(timer);
          } else {
            logout();
          }
        }
      } catch (error) {
        logout();
      }
    }
  });

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
