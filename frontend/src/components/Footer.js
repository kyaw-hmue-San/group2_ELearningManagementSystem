import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={6}>
            <h5>E-Learning Management System</h5>
            <p className="mb-2">
              A comprehensive platform for managing online education, 
              built with Spring Boot and React.
            </p>
            <p className="mb-0">
              <small>University Project - Group 2</small>
            </p>
          </Col>
          <Col lg={3}>
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/dashboard" className="text-light text-decoration-none">Dashboard</a></li>
              <li><a href="/courses" className="text-light text-decoration-none">Courses</a></li>
              <li><a href="/users" className="text-light text-decoration-none">Users</a></li>
            </ul>
          </Col>
          <Col lg={3}>
            <h6>Technology Stack</h6>
            <ul className="list-unstyled">
              <li><i className="fab fa-java me-2"></i>Spring Boot</li>
              <li><i className="fab fa-react me-2"></i>React</li>
              <li><i className="fas fa-database me-2"></i>MySQL</li>
              <li><i className="fab fa-docker me-2"></i>Docker</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col lg={12} className="text-center">
            <p className="mb-0">
              &copy; 2025 E-Learning Management System. Built with ❤️ for university project.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
