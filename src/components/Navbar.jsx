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
                <Link to="/catalog" className="site-title">WindCo</Link>
                <ul>
                    <Link to="/cart" className="cart-button">
                        🛒 Ver Carrito
                        {cantidadTotalItems > 0 && (
                            <span className="cart-badge">
                            {cantidadTotalItems}
                            </span>
                        )}
                    </Link>
                    <button onClick={handleLogout}>Cerrar Sesion</button>
                </ul>
            </nav>
        )
    }
    else {
        return (
            <nav className="nav">
                <Link to="/catalog" className="site-title">WindCo</Link>
                <ul>
                    <Link to="/cart" className="cart-button">
                        🛒 Ver Carrito
                        {cantidadTotalItems > 0 && (
                            <span className="cart-badge">
                            {cantidadTotalItems}
                            </span>
                        )}
                    </Link>
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
