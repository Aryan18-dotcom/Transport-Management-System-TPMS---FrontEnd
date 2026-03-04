import { RouterProvider } from 'react-router'
import { router } from "./appRoutes"
import {AuthProvider} from "./features/auth/authContext.tsx"
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;