import { createBrowserRouter } from "react-router-dom";

import { MainPage } from "./pages/Main";
import { TestPage } from "./pages/Test";

export const router = createBrowserRouter([
  {
    path: "",
    children: [
      {
        path: "",
        element: <MainPage />,
      },
      {
        path: "test",
        element: <TestPage />,
      },
    ],
  },
]);
