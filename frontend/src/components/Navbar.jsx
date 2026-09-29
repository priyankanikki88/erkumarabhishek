import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Home'], ['/about', 'About'], ['/journey', 'Journey'], ['/education', 'Education'],
  ['/experience', 'Experience'], ['/skills', 'Skills'], ['/certifications', 'Certifications'],
  ['/projects', 'Projects'], ['/products', 'Products'], ['/services', 'Services'],
  ['/articles', 'Articles'], ['/blog', 'Blog'], ['/gallery', 'Gallery'], ['/contact', 'Contact']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">Er. Kumar Abhishek</NavLink>
        <button className="nav-toggle" onClick={() => setOpen(!open)}>☰</button>
        <div className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
