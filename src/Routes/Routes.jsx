import { createBrowserRouter } from "react-router";
import Root from "../Components/Root";
import Home from "../layouts/Home/Home";
import Error from "../Components/Error";
import Login from "../layouts/Login/Login";
import Register from "../layouts/Register/Register";
import Dashboard from "../Components/Dashboard";
import Private from "../Context/Private";
import AddClassForm from "../Components/AddClassForm";
import ClassScheduleTracker from "../layouts/ClassScheduleTracker/ClassScheduleTracker";



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
  {
    path:'dashboard',
    element:<Private><Dashboard></Dashboard></Private>,
    
    errorElement:<Error></Error>,
    children:[
      {
        path:'add_class',
        element:<AddClassForm></AddClassForm>
      },
      {
        path:'classes',
        element:<ClassScheduleTracker></ClassScheduleTracker>
      }
    ]
  }
]);