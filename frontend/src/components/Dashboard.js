import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { apiService } from '../services/api';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, coursesResponse, usersResponse] = await Promise.all([
        apiService.getDashboard(),
        apiService.getCourses(),
        apiService.getUsers()
      ]);

      setDashboardData(dashboardResponse.data);
      setRecentCourses(coursesResponse.data.slice(0, 5)); // Show latest 5 courses
      setRecentUsers(usersResponse.data.slice(0, 5)); // Show latest 5 users
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="loading">
          <i className="fas fa-spinner fa-spin fa-2x"></i>
          <p>Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col lg={12} className="mb-4">
          <h2>
            <i className="fas fa-tachometer-alt me-2"></i>
            Dashboard
          </h2>
          <p className="text-muted">System overview and recent activities</p>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-5">
        <Col md={3} className="mb-3">
          <Card className="bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{dashboardData?.users?.total || 0}</h4>
                  <p className="mb-0">Total Users</p>
                </div>
                <i className="fas fa-users fa-2x"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{dashboardData?.courses?.total || 0}</h4>
                  <p className="mb-0">Total Courses</p>
                </div>
                <i className="fas fa-book fa-2x"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{dashboardData?.users?.instructors || 0}</h4>
                  <p className="mb-0">Instructors</p>
                </div>
                <i className="fas fa-chalkboard-teacher fa-2x"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="bg-warning text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{dashboardData?.users?.students || 0}</h4>
                  <p className="mb-0">Students</p>
                </div>
                <i className="fas fa-user-graduate fa-2x"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Data */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-book me-2"></i>
                Recent Courses
              </h5>
            </Card.Header>
            <Card.Body>
              {recentCourses.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Code</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCourses.map((course) => (
                      <tr key={course.id}>
                        <td>
                          <strong>{course.title}</strong>
                          <br />
                          <small className="text-muted">
                            {course.description?.substring(0, 50)}...
                          </small>
                        </td>
                        <td>{course.courseCode}</td>
                        <td>
                          <Badge 
                            bg={course.status === 'PUBLISHED' ? 'success' : 
                                course.status === 'ACTIVE' ? 'primary' : 'secondary'}
                          >
                            {course.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No courses available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Recent Users
              </h5>
            </Card.Header>
            <Card.Body>
              {recentUsers.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.firstName} {user.lastName}</strong>
                          <br />
                          <small className="text-muted">@{user.username}</small>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <Badge 
                            bg={user.role === 'ADMIN' ? 'danger' : 
                                user.role === 'INSTRUCTOR' ? 'warning' : 'info'}
                          >
                            {user.role}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No users available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
