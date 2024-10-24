import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div>
      <NavigationMenu style={{background:"white"}}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <p
              style={{
                color: "rgb(34, 40, 90)",
                fontWeight: "bold",
                fontSize: "25px",
                position: "relative",
                bottom: "2px",
              }}
            >
              Admin Panel
            </p>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavLink to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                User
              </NavigationMenuLink>
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavLink to="/logs">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Logs
              </NavigationMenuLink>
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavLink to="/roles">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Roles
              </NavigationMenuLink>
            </NavLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
