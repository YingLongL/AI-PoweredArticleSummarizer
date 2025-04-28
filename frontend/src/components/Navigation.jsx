import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#eee', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
      <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
      <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
      <Link to="/saved" style={{ marginRight: '10px' }}>Saved Summaries</Link>
    </nav>
  );
}

export default Navigation;