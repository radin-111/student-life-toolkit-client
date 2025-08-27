import { createBrowserRouter } from "react-router";
import Root from "../Components/Root";
import Home from "../layouts/Home/Home";
import Error from "../Components/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement:<Error></Error>,
    children:[
      {
        index:true,
        element:<Home></Home>
      }
    ]
  },
]);