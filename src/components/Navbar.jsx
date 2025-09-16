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
        navigate('/login');
    };

    if (user) {
        return (
            <nav className="nav">
            <Link to="/catalog" className="site-title">WindCo</Link>
            <ul>
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
                <CustomLink to="/login">Login</CustomLink>
                <CustomLink to="/register">Register</CustomLink>
            </ul>
        </nav>
    );
    }
};

function CustomLink({to, children}) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path : resolvedPath.pathname, end: true});

    return (
        <li className={isActive ? "active" : "" }>
            <Link to={to}>{children}</Link>
        </li> 
    )
}