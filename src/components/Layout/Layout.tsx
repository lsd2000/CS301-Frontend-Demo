import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar";
import { Button } from "@/components/ui/button";
import "../../pages/User/AdminPanel.css";

function Layout() {
  // Explicitly type the styles object as React.CSSProperties
  const stickyNavbarStyles: React.CSSProperties = {
    position: "sticky",
    top: 0, // Note: `0` is a number here, but it's also valid to use "0px" if you prefer
    zIndex: 1000,
    backgroundColor: "inherit",
  };

  const handleLogout = () => {
    // Perform logout operations here
    // Have to add clearing user session, calling logout API etc.
    sessionStorage.removeItem("id_token");
    sessionStorage.removeItem("access_token");
    document.cookie =
      "authenticated=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    const logoutUri = encodeURIComponent(
      import.meta.env.VITE_COGNITO_LOGOUT_URI_PROD
    );
    const logoutUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
    //navigate('/login'); // Redirect to the "/" page after logging out
    // Redirect to logout URL
    window.location.href = logoutUrl;
  };

  return (
    <main className="p-6">
      <div style={stickyNavbarStyles}>
        <Navbar />
      </div>
      <Outlet />
      <Button className="LogoutButton" onClick={handleLogout}>
        Log out
      </Button>
    </main>
  );
}

export default Layout;
