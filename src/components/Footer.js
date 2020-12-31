import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Footer() {
  return (
    <>
      <ul>
        <li className="nav-item">
          <Link to="/about" className="nav-links">
            About Tect.dev
          </Link>
        </li>
      </ul>
    </>
  );
}
