import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider, Navigate } from "react-router-dom"; // 1. Import Hash Router
import App from "./App";
import LoginPage from "./pages/login";
// import DashboardPage from "./pages/dashboard";
import { Buffer } from "buffer";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux";
import { Calendar } from "./pages/calendar";
import { Icon } from "./pages/icon";

window.Buffer = Buffer;

export type DashboardPageParams = void;
export type CalendarPageParams = {
  month: number;
  year: number;
};

const router = createHashRouter([
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },
  // {
  //   path: "/dashboard",
  //   element: <DashboardPage />,
  // },
  ...Calendar.routes,
  ...Icon.routes,
  {
    path: "/",
    element: <Navigate to="/c/t" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <App>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </App>
  </Provider>
);
