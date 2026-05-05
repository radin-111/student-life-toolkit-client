import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const instance = axios.create({
  baseURL: "https://student-life-toolkit-server.vercel.app",
});

const useAxios = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    const reqInterceptor = instance.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error.response?.status;

        if (status === 401) {
          try {
            await handleLogout();
            navigate("/login");
          } catch (err) {
            console.error(err);
          }
        }

        if (status === 403) {
          navigate("/forbidden"); // redirect instead of returning JSX
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors (VERY IMPORTANT)
    return () => {
      instance.interceptors.request.eject(reqInterceptor);
      instance.interceptors.response.eject(resInterceptor);
    };
  }, [user, handleLogout, navigate]);

  return instance;
};

export default useAxios;