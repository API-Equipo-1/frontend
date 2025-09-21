import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useMatch, useResolvedPath } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { cantidadTotalItems } = useCart();
    const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

    if (user) {
        return (
            <nav className="nav">
                <Link to="/catalog" className="site-title">
                    <img src="/windco.png" alt="WindCo" className="logo" />
                    <span className="brand-name">WindCo</span>
                </Link>
                <ul>

                    <button onClick={handleLogout}>Cerrar Sesion</button>
                </ul>
            </nav>
        )
    }
    else {
        return (
            <nav className="nav">
                <Link to="/catalog" className="site-title">
                    <img src="/windco.png" alt="WindCo" className="logo" />
                    <span className="brand-name">WindCo</span>
                </Link>
                <ul>
                   
                    <CustomLink to="/login">Login</CustomLink>
                    <CustomLink to="/register">Register</CustomLink>
                </ul>
            </nav>
        );
    }
};

function CustomLink({ to, children }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to}>{children}</Link>
    </li>
  );
}
