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
    navigate("/catalog");
  };

    if (user) {
        return (
            <nav className="nav">
                <Link to="/catalog" className="site-title">
                    <img src="/windco.png" alt="WindCo" className="logo" />
                    <span className="brand-name">WindCo</span>
                </Link>
                <div className="user-controls">
                    <div
                        className="user-dropdown-container"
                        onMouseEnter={() => {
                            const menu = document.getElementById("user-dropdown-menu");
                            if (menu) menu.style.display = "block";
                        }}
                        onMouseLeave={() => {
                            const menu = document.getElementById("user-dropdown-menu");
                            if (menu) menu.style.display = "none";
                        }}
                    >
                        <button className="user-dropdown-button">
                            Bienvenido/a, {user.firstName} ▼
                        </button>
                        <div id="user-dropdown-menu" className="user-dropdown-menu">
                            <button
                                className="dropdown-menu-item"
                                onClick={() => {
                                    navigate("/product-management");
                                    document.getElementById("user-dropdown-menu").style.display =
                                        "none";
                                }}
                            >
                                Gestionar Mis Productos
                            </button>
                            <button
                                className="dropdown-menu-item logout"
                                onClick={handleLogout}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        );
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
