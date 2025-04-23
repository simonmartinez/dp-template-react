import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/authentication/Login";
import LayoutDisconnected from "./layouts/LayoutDisconnected";
import LayoutMain from "./layouts/LayoutMain";
import DashboardOne from "./pages/dashboard/DashboardOne";
import DashboardTwo from "./pages/dashboard/DashboardTwo";
// PLOP: ADD NEW COMPONENTS HERE

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutMain />,
        children: [
            { path: "/", element: <Home /> },
            {
                path: "/dashboard", children: [
                    {
                        path: 'one', element: <DashboardOne />
                    }, {
                        path: 'two', element: <DashboardTwo />
                    }
                    // PLOP: ADD DASHBOARD HERE
                ]
            },
        ],
    },
    {
        path: "/authentication",
        element: <LayoutDisconnected />,
        children: [
            { path: "login", element: <Login /> },
        ]
    },
    { path: "*", element: <NotFound /> },
], {
    basename: import.meta.env.BASE_URL
});
