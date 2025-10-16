import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <i className="fas fa-graduation-cap me-2"></i>
          E-Learning System
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <i className="fas fa-home me-1"></i>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard">
              <i className="fas fa-tachometer-alt me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/courses">
              <i className="fas fa-book me-1"></i>
              Courses
            </Nav.Link>
            <Nav.Link as={Link} to="/users">
              <i className="fas fa-users me-1"></i>
              Users
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/register">
              <i className="fas fa-user-plus me-1"></i>
              Register
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/login">
              <i className="fas fa-shield-alt me-1"></i>
              Admin
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
