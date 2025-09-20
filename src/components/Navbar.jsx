import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useMatch, useResolvedPath } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (user) {
    return (
      <nav className="nav">
        <Link to="/catalog" className="site-title">
          WindCo
        </Link>
        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
        >
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => {
              const menu = document.getElementById("user-dropdown-menu");
              if (menu) menu.style.display = "block";
            }}
            onMouseLeave={() => {
              const menu = document.getElementById("user-dropdown-menu");
              if (menu) menu.style.display = "none";
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                color: "#222",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                padding: "0.5rem 1.2rem",
                borderRadius: "20px",
              }}
            >
              Bienvenido/a, {user.firstName} ▼
            </button>
            <div
              id="user-dropdown-menu"
              style={{
                display: "none",
                position: "absolute",
                right: 0,
                top: "2.2rem",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                minWidth: "180px",
                zIndex: 10,
                overflow: "hidden",
              }}
            >
              <button
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "0.8rem 1rem",
                  textAlign: "left",
                  fontSize: "1rem",
                  color: "#222",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#e0e7ff")}
                onMouseLeave={(e) => (e.target.style.background = "none")}
                onClick={() => {
                  navigate("/product-management");
                  document.getElementById("user-dropdown-menu").style.display =
                    "none";
                }}
              >
                Gestionar Mis Productos
              </button>
              <button
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "0.8rem 1rem",
                  textAlign: "left",
                  fontSize: "1rem",
                  color: "#222",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#fee2e2")}
                onMouseLeave={(e) => (e.target.style.background = "none")}
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="nav">
        <Link to="/catalog" className="site-title">
          WindCo
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
