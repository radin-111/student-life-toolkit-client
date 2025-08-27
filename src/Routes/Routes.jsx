import { createBrowserRouter } from "react-router";
import Root from "../Components/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    
  },
]);