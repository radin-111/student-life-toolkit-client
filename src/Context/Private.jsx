import React from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../Components/Loading";
import { Navigate } from "react-router";

const Private = ({children}) => {
  const { user, loading } = useAuth();

  if(loading){
    return <Loading></Loading>;
  }

  if(!user){
    return <Navigate to={'/login'}></Navigate>
  }

  return  children;
};

export default Private;
