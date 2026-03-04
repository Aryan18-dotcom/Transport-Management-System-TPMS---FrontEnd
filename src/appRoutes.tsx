import { createBrowserRouter } from "react-router"
import Login from "./features/auth/pages/Login.tsx"
import Register from "./features/auth/pages/Register.tsx"
import Dashboard from "./features/AdminDashboard/pages/Dashboard.tsx"
import ProtectedRoute from "./features/AdminDashboard/services/ProtectedRoute.tsx"
import CreateEmployee from "./features/AdminDashboard/pages/Employees/CreateEmployee.tsx"
import MainDashboard from "./features/AdminDashboard/components/MainDahboard.tsx"
import GetAllEmployee from "./features/AdminDashboard/pages/Employees/GetAllEmployee.tsx"
import ManageEmployee from "./features/AdminDashboard/pages/Employees/ManageEmployee.tsx"
import EditEmployee from "./features/AdminDashboard/components/EditEmployee.tsx"
import EmployeeProfile from "./features/AdminDashboard/components/EmployeeProfile.tsx"

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: "/",
        element: <h1>LandingPage</h1>
    },
    {
        path: "/admin-dashboard",
        element: (<ProtectedRoute><Dashboard /></ProtectedRoute>), children: [
            {
                index: true,
                element: <MainDashboard />
            },
            {
                path: "employees/add",
                element: <CreateEmployee />
            },
            {
                path: "employees/all",
                element: <GetAllEmployee />
            },
            {
                path: "employees/:employeeId",
                element: <EmployeeProfile />
            },
            {
                path: "employees/edit",
                element: <ManageEmployee />
            },
            {
                path: "employees/edit/:employeeId",
                element: <EditEmployee />
            },
        ]
    },
    {
        path: "/employee-dashboard",
        element: <ProtectedRoute><h1>Employee Dashboard</h1></ProtectedRoute>
    },
])