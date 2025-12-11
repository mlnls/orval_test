import { createRoot } from "react-dom/client";
import { router } from "./Router.tsx";
import { RouterProvider } from "react-router-dom";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
