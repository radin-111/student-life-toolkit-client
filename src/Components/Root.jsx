import React from "react";
import Nav from "./Nav";
import { Outlet } from "react-router";
import Foot from "./Foot";


const Root = () => {
  
  return (
    <div>
      <Nav></Nav>
      <Outlet></Outlet>
      <Foot></Foot>
    </div>
  );
};

export default Root;
