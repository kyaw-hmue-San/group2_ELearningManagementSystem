import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/admin/login', credentials);
      
      if (response.data.success) {
        // Store admin data in localStorage
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        localStorage.setItem('isAdminLoggedIn', 'true');
        
        // Call parent component's onLogin function
        if (onLogin) {
          onLogin(response.data.admin);
        }
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <i className="fas fa-shield-alt fa-3x text-primary mb-3"></i>
                <h3>Admin Login</h3>
                <p className="text-muted">E-Learning Management System</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-user me-2"></i>
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter admin username"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="fas fa-lock me-2"></i>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  For technical staff only
                </small>
              </div>

              {/* Demo credentials info */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Demo Credentials:</strong><br/>
                  Username: <code>admin</code><br/>
                  Password: <code>admin123</code>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminLogin;
