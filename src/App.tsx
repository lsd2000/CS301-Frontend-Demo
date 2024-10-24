import LandingPage from "./pages/Auth/LandingPage.tsx";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/User/AdminPanel.tsx";
import UserLogs from "./pages/UserLogs/UserLogs.tsx";
import Layout from "./components/Layout/Layout.tsx";
import UserRoles from "./pages/User/UserRoles.tsx";
import AuthCallbackPage from "./components/auth/AuthCallbackPage.tsx";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const useAuth = () => {
  const isAuthenticated = (): boolean => {
    const hasTokens =
      !!sessionStorage.getItem("id_token") &&
      !!sessionStorage.getItem("access_token");
    const isCookieAuthenticated = document.cookie
      .split(";")
      .some((item: string) => item.trim().startsWith("authenticated=true"));
    return hasTokens && isCookieAuthenticated;
  };
  return { isAuthenticated };
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LandingPage />} />
        <Route path="/auth" element={<AuthCallbackPage />} />
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <UserLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <UserRoles />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
