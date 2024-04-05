
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg'
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
            </div>
            <nav className="navigation">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/warehouses" className="nav-link">Warehouses</Link>
                <Link to="/products" className="nav-link">Products</Link>
            </nav>
        </header>
    );
}

export default Header;
