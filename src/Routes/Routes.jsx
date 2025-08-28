import { createBrowserRouter } from "react-router";
import Root from "../Components/Root";
import Home from "../layouts/Home/Home";
import Error from "../Components/Error";
import Login from "../layouts/Login/Login";
import Register from "../layouts/Register/Register";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement:<Error></Error>,
    children:[
      {
        index:true,
        element:<Home></Home>
      },
      {
        path:'login',
        element:<Login></Login>
      },
      {
        path:'register',
        element:<Register></Register>
      }
    ]
  },
]);