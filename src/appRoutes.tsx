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
import LandingPage from "./features/LandingPage.tsx"
import AddTruck from "./features/Trucks/pages/AddTruck.tsx"
import { TrucksProvider } from "./features/Trucks/trucksContext.tsx"
import AllTrucks from "./features/Trucks/pages/AllTrucks.tsx"
import TruckDetails from "./features/Trucks/components/TruckDetails.tsx"
import ManageAllTrucks from "./features/Trucks/pages/ManageAllTrucks.tsx"
import EditTruckDetail from "./features/Trucks/components/EditTruckDetails.tsx"
import { DriversProvider } from "./features/Drivers/driverContext.tsx"
import AddDriver from "./features/Drivers/pages/AddDriver.tsx"
import DriversDirectory from "./features/Drivers/pages/DriversDirectory.tsx"
import DriverDetails from "./features/Drivers/components/DriversDetails.tsx"
import PersonnelFiles from "./features/Drivers/pages/PerssionalFiles.tsx"
import UpdateDriversDetails from "./features/Drivers/components/UpdateDriversDetails.tsx"
import FleetAssignment from "./features/Drivers/pages/FleetAssignment.tsx"
import ManageAssignment from "./features/Drivers/components/ManageAssignment.tsx"
import Maintenance from "./features/Maintenance/pages/Maintainence.tsx"
import { MaintenanceProvider } from "./features/Maintenance/maintenanceContext.tsx"
import AddMaintenance from "./features/Maintenance/components/AddMaintenance.tsx"
import ManageMaintenance from "./features/Maintenance/pages/ManageMaintenance.tsx"
import EditMaintenance from "./features/Maintenance/components/EditMaintenance.tsx"
import MaintenanceDetails from "./features/Maintenance/components/MaintenanceDetails.tsx"
import AddPartner from "./features/Partner/pages/AddPartner.tsx"
import { PartnerProvider } from "./features/Partner/partnerContext.tsx"
import AllPartners from "./features/Partner/pages/AllPartners.tsx"
import PartnerDetails from "./features/Partner/components/PartnerDetials.tsx"
import ManagePartners from "./features/Partner/pages/ManagePartners.tsx"
import EditPartnerDetails from "./features/Partner/components/EditPartnerDetails.tsx"
import { TripsProvider } from "./features/Trips/tripsContext.tsx"
import AddTrip from "./features/Trips/pages/AddTrip.tsx"
import ViewTrips from "./features/Trips/pages/ViewTrips.tsx"
import ViewTripsDetails from "./features/Trips/components/ViewTripsDetails.tsx"
import ManageTrips from "./features/Trips/pages/ManageTrips.tsx"
import EditTripsDetails from "./features/Trips/components/EditTripsDetails.tsx"
import GenerateBill from "./features/Bills/pages/GenerateBill.tsx"
import AllBills from "./features/Bills/pages/AllBills.tsx"
import BillDetails from "./features/Bills/component/BillDetails.tsx"
import UpdateBillDetails from "./features/Bills/component/UpdateBillDetails.tsx"
import ManageBills from "./features/Bills/pages/ManageBills.tsx"
import { InvoiceProvider } from "./features/Invoices/InvoiceContext.tsx"
import CreateInvoice from "./features/Invoices/pages/CreateInvoice.tsx"
import { BillProvider } from "./features/Bills/billContext.tsx"
import InvoiceDetails from "./features/Invoices/components/InvoiceDetails.tsx"
import AllInvoices from "./features/Invoices/pages/AllInvoices.tsx"

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
        element: <LandingPage />
    },
    {
        path: "/admin-dashboard",
        element: (<ProtectedRoute><Dashboard /></ProtectedRoute>), children: [
            {
                index: true,
                element: <TrucksProvider><TripsProvider><MainDashboard /></TripsProvider></TrucksProvider>
            },
            // EMPLOYESS REALTED FUNCTIONS 👤
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
            // TRUCK RELATED FUNCTIONS 🚚
            {
                path: "truck/add",
                element: <TrucksProvider><AddTruck /></TrucksProvider>
            },
            {
                path: "truck/all",
                element: <TrucksProvider><AllTrucks /></TrucksProvider>
            },
            {
                path: "truck/:truckId",
                element: <TrucksProvider><TruckDetails /></TrucksProvider>
            },
            {
                path: "truck/edit",
                element: <TrucksProvider><ManageAllTrucks /></TrucksProvider>
            },
            {
                path: "truck/edit/:truckId",
                element: <TrucksProvider><DriversProvider><EditTruckDetail /></DriversProvider></TrucksProvider>
            },

            // DRIVERS RELATED FUNCTIONS 👳‍♂️
            {
                path: "driver/add",
                element: <DriversProvider><AddDriver /></DriversProvider>
            },
            {
                path: "driver/all",
                element: <DriversProvider><DriversDirectory /></DriversProvider>
            },
            {
                path: "driver/details/:driverId",
                element: <DriversProvider><DriverDetails /></DriversProvider>
            },
            {
                path: "driver/edit/",
                element: <DriversProvider><PersonnelFiles /></DriversProvider>
            },
            {
                path: "driver/edit/:driverId",
                element: <DriversProvider><UpdateDriversDetails /></DriversProvider>
            },
            {
                path: "driver/assignments",
                element: <DriversProvider><FleetAssignment /></DriversProvider>
            },
            {
                path: "driver/manage-assignment/:driverId",
                element: <DriversProvider><TrucksProvider><ManageAssignment /></TrucksProvider></DriversProvider>
            },
            // MAINTENANCE RELATED FUNCTIONS ⛑
            {
                path: 'truck/maintenance',
                element: <MaintenanceProvider><TrucksProvider><Maintenance /></TrucksProvider></MaintenanceProvider>
            },
            {
                path: 'truck/maintenance/add',
                element: <MaintenanceProvider><TrucksProvider><AddMaintenance /></TrucksProvider></MaintenanceProvider>
            },
            {
                path: 'truck/maintenance/:recordId',
                element: <MaintenanceProvider><TrucksProvider><MaintenanceDetails /></TrucksProvider></MaintenanceProvider>
            },
            {
                path: 'truck/maintenance/manage',
                element: <MaintenanceProvider><TrucksProvider><ManageMaintenance /></TrucksProvider></MaintenanceProvider>
            },
            {
                path: 'truck/maintenance/manage/:recordId',
                element: <MaintenanceProvider><TrucksProvider><EditMaintenance /></TrucksProvider></MaintenanceProvider>
            },
            // PARTNERS REALTED FUNCTIONS
            {
                path: 'partner/add',
                element: <PartnerProvider><AddPartner /></PartnerProvider>
            },
            {
                path: 'partner/all',
                element: <PartnerProvider><AllPartners /></PartnerProvider>
            },
            {
                path: 'partner/:partnerId',
                element: <PartnerProvider><PartnerDetails /></PartnerProvider>
            },
            {
                path: 'partner/manage',
                element: <PartnerProvider><ManagePartners /></PartnerProvider>
            },
            {
                path: 'partner/manage/:partnerId',
                element: <PartnerProvider><EditPartnerDetails /></PartnerProvider>
            },
            // TRIPS REALTED FUNCTIONS
            {
                path: 'trips/add',
                element: <TripsProvider><TrucksProvider><DriversProvider><PartnerProvider><AddTrip /></PartnerProvider></DriversProvider></TrucksProvider></TripsProvider>
            },
            {
                path: 'trips/all',
                element: <TripsProvider><ViewTrips /></TripsProvider>
            },
            {
                path: 'trip/:tripId',
                element: <TripsProvider><ViewTripsDetails /></TripsProvider>
            },
            {
                path: 'trips/manage',
                element: <TripsProvider><ManageTrips /></TripsProvider>
            },
            {
                path: 'trips/manage/:tripId',
                element: <TripsProvider><EditTripsDetails /></TripsProvider>
            },
            // BILLS RELATED FUNCTIONS
            {
                path:'bill/new',
                element: <BillProvider><TripsProvider><PartnerProvider><TripsProvider><GenerateBill /></TripsProvider></PartnerProvider></TripsProvider></BillProvider>
            },
            {
                path:'bill/all',
                element: <BillProvider><AllBills /></BillProvider>
            },
            {
                path:'bill/:billId',
                element: <BillProvider><BillDetails /></BillProvider>
            },
            {
                path:'bill/manage',
                element: <BillProvider><ManageBills /></BillProvider>
            },
            {
                path:'bill/manage/:billId',
                element: <BillProvider><TripsProvider><PartnerProvider><TripsProvider><UpdateBillDetails /></TripsProvider></PartnerProvider></TripsProvider></BillProvider>
            },
            // INVOICE REALTED FUNCTIONS
            {
                path: 'invoice/new',
                element: <InvoiceProvider><BillProvider><CreateInvoice /></BillProvider></InvoiceProvider>
            },
            {
                path: 'invoice/all',
                element: <InvoiceProvider><BillProvider><AllInvoices /></BillProvider></InvoiceProvider>
            },
            {
                path: 'invoice/:invoiceId',
                element: <InvoiceProvider><InvoiceDetails /></InvoiceProvider>
            },
        ]
    },
    
    {
        path: "/employee-dashboard",
        element: <ProtectedRoute><h1>Employee Dashboard</h1></ProtectedRoute>
    },
])