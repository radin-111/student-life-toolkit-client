import axios from "axios";
import React from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const instance = axios.create({
  baseURL: "https://student-life-toolkit-server.vercel.app",
});

const useAxios = () => {
  const { user, handleLogout } = useAuth();

  const navigate = useNavigate();

  instance.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      const status = error.status;
      if (status === 403) {
        return <Forbidden></Forbidden>;
      } else if (status === 401) {
        handleLogout()
          .then(() => {
            navigate("/login");
          })
          .catch(() => {});
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
