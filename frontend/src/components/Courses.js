import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { apiService } from '../services/api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiService.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await apiService.searchCourses(searchTerm);
        setCourses(response.data);
      } catch (error) {
        console.error('Error searching courses:', error);
      }
    } else {
      fetchCourses();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PUBLISHED': { bg: 'success', text: 'Published' },
      'ACTIVE': { bg: 'primary', text: 'Active' },
      'DRAFT': { bg: 'secondary', text: 'Draft' },
      'COMPLETED': { bg: 'info', text: 'Completed' },
      'CANCELLED': { bg: 'danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="loading">
          <i className="fas fa-spinner fa-spin fa-2x"></i>
          <p>Loading courses...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col lg={12} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="fas fa-book me-2"></i>
                Courses
              </h2>
              <p className="text-muted">Browse and manage available courses</p>
            </div>
            <Button variant="primary">
              <i className="fas fa-plus me-2"></i>
              Add Course
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col lg={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline-secondary" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col lg={6} className="text-end">
          <Button variant="outline-primary" onClick={fetchCourses} className="me-2">
            <i className="fas fa-sync-alt me-1"></i>
            Refresh
          </Button>
          <Button variant="outline-success">
            <i className="fas fa-filter me-1"></i>
            Filter
          </Button>
        </Col>
      </Row>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <Row>
          {courses.map((course) => (
            <Col lg={4} md={6} className="mb-4" key={course.id}>
              <Card className="h-100 course-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">{course.title}</h5>
                    {getStatusBadge(course.status)}
                  </div>
                  
                  <p className="text-muted mb-2">
                    <strong>Code:</strong> {course.courseCode}
                  </p>
                  
                  <p className="card-text">
                    {course.description?.length > 100 
                      ? `${course.description.substring(0, 100)}...` 
                      : course.description}
                  </p>
                  
                  <div className="course-details mb-3">
                    <small className="text-muted d-block">
                      <i className="fas fa-clock me-1"></i>
                      Credit Hours: {course.creditHours}
                    </small>
                    <small className="text-muted d-block">
                      <i className="fas fa-users me-1"></i>
                      Max Students: {course.maxStudents}
                    </small>
                    {course.instructor && (
                      <small className="text-muted d-block">
                        <i className="fas fa-chalkboard-teacher me-1"></i>
                        Instructor: {course.instructor.firstName} {course.instructor.lastName}
                      </small>
                    )}
                  </div>
                </Card.Body>
                
                <Card.Footer className="bg-transparent">
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-primary" size="sm">
                      <i className="fas fa-eye me-1"></i>
                      View
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="fas fa-edit me-1"></i>
                      Edit
                    </Button>
                    <Button variant="outline-success" size="sm">
                      <i className="fas fa-user-plus me-1"></i>
                      Enroll
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          <Col lg={12} className="text-center py-5">
            <i className="fas fa-book fa-3x text-muted mb-3"></i>
            <h4>No courses found</h4>
            <p className="text-muted">
              {searchTerm ? 'Try adjusting your search terms' : 'No courses are available at the moment'}
            </p>
            <Button variant="primary">
              <i className="fas fa-plus me-2"></i>
              Create First Course
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Courses;
