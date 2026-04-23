import { Container, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Explore', end: true },
  { to: '/bookmarks', label: 'Bookmarks' },
  { to: '/submit', label: 'Submit' },
  { to: '/about', label: 'About' }
]

export default function NavigationBar() {
  return (
    <Navbar expand="lg" className="ssf-navbar" sticky="top">
      <Container className="py-2">
        <Navbar.Brand as={NavLink} to="/" className="ssf-brand">
          <span className="brand-mark">SSF</span>
          <div>
            <div className="brand-title">Study Spot Finder</div>
            <div className="brand-subtitle">UW-Madison study spaces with live community updates</div>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="ssf-nav" />

        <Navbar.Collapse id="ssf-nav" className="justify-content-end">
          <div className="ssf-nav-links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}