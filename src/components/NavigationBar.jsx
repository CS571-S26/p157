import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="md" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Study Spot Finder
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="ssf-nav" />
        <Navbar.Collapse id="ssf-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Explore
            </Nav.Link>
            <Nav.Link as={NavLink} to="/bookmarks">
              Bookmarks
            </Nav.Link>
            <Nav.Link as={NavLink} to="/submit">
              Submit
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}