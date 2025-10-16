import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      showAlert('Passwords do not match!', 'danger');
      return;
    }

    if (formData.password.length < 6) {
      showAlert('Password must be at least 6 characters long!', 'danger');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      await axios.post('http://localhost:8080/api/users/register', userData);
      
      showAlert('Registration successful! You can now login.', 'success');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      showAlert(
        error.response?.data || 'Registration failed. Please try again.', 
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Header className="bg-primary text-white text-center">
                <h3 className="mb-0">
                  <i className="fas fa-user-plus me-2"></i>
                  Create Account
                </h3>
              </Card.Header>
              <Card.Body className="p-4">
                {alert.show && (
                  <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
                    {alert.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-user me-1"></i>
                          First Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-user me-1"></i>
                          Last Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fas fa-envelope me-1"></i>
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fas fa-user-tag me-1"></i>
                      Account Type
                    </Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="STUDENT">Student</option>
                      <option value="INSTRUCTOR">Instructor</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Choose your role in the e-learning system
                    </Form.Text>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-lock me-1"></i>
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          minLength="6"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-lock me-1"></i>
                          Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          minLength="6"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />
                
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      <i className="fas fa-sign-in-alt me-1"></i>
                      Login Here
                    </Link>
                  </p>
                  <p className="mt-2 mb-0">
                    <Link to="/admin/login" className="text-muted text-decoration-none">
                      <i className="fas fa-user-shield me-1"></i>
                      Admin Login
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;
