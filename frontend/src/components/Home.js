import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiService.getStatus();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to E-Learning Management System
              </h1>
              <p className="lead mb-4">
                A comprehensive platform for managing courses, students, and instructors. 
                Built with Spring Boot and React for our university project.
              </p>
              <Button as={Link} to="/dashboard" size="lg" variant="light" className="me-3">
                <i className="fas fa-tachometer-alt me-2"></i>
                View Dashboard
              </Button>
              <Button as={Link} to="/courses" size="lg" variant="outline-light">
                <i className="fas fa-book me-2"></i>
                Browse Courses
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <Container className="my-5">
        <Row>
          <Col lg={12} className="text-center mb-5">
            <h2>System Overview</h2>
            <p className="text-muted">Current statistics of our e-learning platform</p>
          </Col>
        </Row>
        
        {loading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin fa-2x"></i>
            <p>Loading statistics...</p>
          </div>
        ) : (
          <Row>
            <Col md={3} className="mb-4">
              <Card className="stats-card text-center p-4">
                <Card.Body>
                  <i className="fas fa-users fa-3x mb-3"></i>
                  <h3>{stats?.totalUsers || 0}</h3>
                  <p className="mb-0">Total Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="stats-card text-center p-4">
                <Card.Body>
                  <i className="fas fa-book fa-3x mb-3"></i>
                  <h3>{stats?.totalCourses || 0}</h3>
                  <p className="mb-0">Total Courses</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="stats-card text-center p-4">
                <Card.Body>
                  <i className="fas fa-chalkboard-teacher fa-3x mb-3"></i>
                  <h3>{stats?.totalInstructors || 0}</h3>
                  <p className="mb-0">Instructors</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="stats-card text-center p-4">
                <Card.Body>
                  <i className="fas fa-user-graduate fa-3x mb-3"></i>
                  <h3>{stats?.totalStudents || 0}</h3>
                  <p className="mb-0">Students</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Features Section */}
      <Container className="my-5">
        <Row>
          <Col lg={12} className="text-center mb-5">
            <h2>Key Features</h2>
            <p className="text-muted">What our e-learning platform offers</p>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <i className="fas fa-graduation-cap fa-3x text-primary mb-3"></i>
                <Card.Title>Course Management</Card.Title>
                <Card.Text>
                  Create, manage, and organize courses with detailed descriptions, 
                  schedules, and enrollment tracking.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <i className="fas fa-users fa-3x text-success mb-3"></i>
                <Card.Title>User Management</Card.Title>
                <Card.Text>
                  Manage students, instructors, and administrators with 
                  role-based access control and user profiles.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <i className="fas fa-chart-line fa-3x text-info mb-3"></i>
                <Card.Title>Analytics Dashboard</Card.Title>
                <Card.Text>
                  Track progress, monitor enrollment statistics, and 
                  generate reports for better decision making.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
