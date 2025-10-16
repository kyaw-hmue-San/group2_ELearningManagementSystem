import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Nav, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const storedAdminData = localStorage.getItem('adminData');
    
    if (!isLoggedIn || !storedAdminData) {
      navigate('/admin/login');
      return;
    }
    
    setAdminData(JSON.parse(storedAdminData));
    fetchDashboardData();
  }, [navigate]);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'courses') {
      fetchPendingCourses();
    } else if (activeTab === 'support') {
      fetchSupportRequests();
    } else if (activeTab === 'certificates') {
      fetchCertificates();
    } else if (activeTab === 'enrollments') {
      fetchEnrollments();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/courses/pending');
      setPendingCourses(response.data);
    } catch (error) {
      console.error('Error fetching pending courses:', error);
    }
  };

  const fetchSupportRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/support-requests');
      setSupportRequests(response.data);
    } catch (error) {
      console.error('Error fetching support requests:', error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/certificates');
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/enrollments');
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchAllAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/all-admins');
      setAllAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      showAlert('Error fetching admin accounts: ' + (error.response?.data || error.message), 'danger');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleApproveCourse = async (courseId) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/courses/${courseId}/approve`, {
        adminId: adminData.id,
        feedback: formData.feedback || 'Course approved'
      });
      showAlert('Course approved successfully!');
      fetchPendingCourses();
      setShowModal(false);
    } catch (error) {
      showAlert('Error approving course: ' + error.response?.data || error.message, 'danger');
    }
  };

  const handleRejectCourse = async (courseId) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/courses/${courseId}/reject`, {
        adminId: adminData.id,
        feedback: formData.feedback || 'Course rejected'
      });
      showAlert('Course rejected successfully!');
      fetchPendingCourses();
      setShowModal(false);
    } catch (error) {
      showAlert('Error rejecting course: ' + error.response?.data || error.message, 'danger');
    }
  };

  const handleCreateAdmin = async () => {
    try {
      await axios.post('http://localhost:8080/api/admin/create', formData);
      showAlert('Admin created successfully!');
      setShowModal(false);
      setFormData({});
    } catch (error) {
      showAlert('Error creating admin: ' + error.response?.data || error.message, 'danger');
    }
  };

  const handleIssueCertificate = async () => {
    try {
      await axios.post('http://localhost:8080/api/certificates/issue', formData);
      showAlert('Certificate issued successfully!');
      fetchCertificates();
      setShowModal(false);
      setFormData({});
    } catch (error) {
      showAlert('Error issuing certificate: ' + error.response?.data || error.message, 'danger');
    }
  };

  const handleRevokeCertificate = async (certificateId) => {
    try {
      await axios.put(`http://localhost:8080/api/certificates/${certificateId}/revoke`, {
        adminId: adminData.id,
        reason: formData.revokeReason || 'Certificate revoked by administrator'
      });
      showAlert('Certificate revoked successfully!');
      fetchCertificates();
      setShowModal(false);
      setFormData({});
    } catch (error) {
      showAlert('Error revoking certificate: ' + error.response?.data || error.message, 'danger');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PUBLISHED': { bg: 'success', text: 'Published' },
      'ACTIVE': { bg: 'primary', text: 'Active' },
      'DRAFT': { bg: 'secondary', text: 'Draft' },
      'STUDENT': { bg: 'info', text: 'Student' },
      'INSTRUCTOR': { bg: 'warning', text: 'Instructor' },
      'ADMIN': { bg: 'danger', text: 'Admin' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin fa-2x"></i>
          <p>Loading admin dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="bg-dark text-white py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <i className="fas fa-tachometer-alt me-2"></i>
                Admin Dashboard
              </h4>
              {adminData && (
                <small>Welcome back, {adminData.fullName}</small>
              )}
            </Col>
            <Col xs="auto">
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-1"></i>
                Logout
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-4">
        {/* Navigation Tabs */}
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-line me-1"></i>
              Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users me-1"></i>
              User Management
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'courses'} 
              onClick={() => setActiveTab('courses')}
            >
              <i className="fas fa-book me-1"></i>
              Course Management
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'enrollments'} 
              onClick={() => setActiveTab('enrollments')}
            >
              <i className="fas fa-user-graduate me-1"></i>
              Enrollments
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'certificates'} 
              onClick={() => setActiveTab('certificates')}
            >
              <i className="fas fa-certificate me-1"></i>
              Certificates
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'support'} 
              onClick={() => setActiveTab('support')}
            >
              <i className="fas fa-life-ring me-1"></i>
              Support
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <>
            {/* Statistics Cards */}
            <Row className="mb-4">
              <Col md={3} className="mb-3">
                <Card className="bg-primary text-white h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h3>{dashboardData.totalUsers}</h3>
                        <p className="mb-0">Total Users</p>
                      </div>
                      <i className="fas fa-users fa-2x opacity-75"></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="bg-success text-white h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h3>{dashboardData.totalStudents}</h3>
                        <p className="mb-0">Students</p>
                      </div>
                      <i className="fas fa-user-graduate fa-2x opacity-75"></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="bg-warning text-white h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h3>{dashboardData.totalInstructors}</h3>
                        <p className="mb-0">Instructors</p>
                      </div>
                      <i className="fas fa-chalkboard-teacher fa-2x opacity-75"></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="bg-info text-white h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h3>{dashboardData.totalCourses}</h3>
                        <p className="mb-0">Total Courses</p>
                      </div>
                      <i className="fas fa-book fa-2x opacity-75"></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Activity */}
            <Row>
              <Col lg={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-users me-2"></i>
                      Recent Users
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {dashboardData.recentUsers && dashboardData.recentUsers.length > 0 ? (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.recentUsers.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <strong>{user.firstName} {user.lastName}</strong>
                                <br />
                                <small className="text-muted">@{user.username}</small>
                              </td>
                              <td>{getStatusBadge(user.role)}</td>
                              <td>{user.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-muted">No recent users</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-book me-2"></i>
                      Recent Courses
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {dashboardData.recentCourses && dashboardData.recentCourses.length > 0 ? (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Course</th>
                            <th>Status</th>
                            <th>Students</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.recentCourses.map((course) => (
                            <tr key={course.id}>
                              <td>
                                <strong>{course.title}</strong>
                                <br />
                                <small className="text-muted">{course.courseCode}</small>
                              </td>
                              <td>{getStatusBadge(course.status)}</td>
                              <td>
                                <span className="badge bg-light text-dark">
                                  0/{course.maxStudents}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-muted">No recent courses</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* User Management Tab - Admin Creation Only */}
        {activeTab === 'users' && (
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-shield-alt me-2"></i>
                Admin Management
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">Create and manage administrator accounts. Students and instructors register themselves.</p>
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <h4>{dashboardData?.totalStudents || 0}</h4>
                      <p className="mb-0">Students (Self-Registered)</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <h4>{dashboardData?.totalInstructors || 0}</h4>
                      <p className="mb-0">Instructors (Self-Registered)</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                      <h4>{dashboardData?.totalAdmins || 0}</h4>
                      <p className="mb-0">Admins (Admin-Created)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setModalType('createAdmin');
                    setFormData({});
                    setShowModal(true);
                  }}
                >
                  <i className="fas fa-user-plus me-1"></i>
                  Create New Admin
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={() => {
                    fetchAllAdmins();
                    setModalType('viewAllAdmins');
                    setShowModal(true);
                  }}
                >
                  <i className="fas fa-users-cog me-1"></i>
                  View All Admins
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Course Management Tab - Approval System */}
        {activeTab === 'courses' && (
          <>
            <Row className="mb-4">
              <Col md={4}>
                <Card className="bg-warning text-white">
                  <Card.Body className="text-center">
                    <h4>{pendingCourses.length}</h4>
                    <p className="mb-0">Pending Approval</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="bg-success text-white">
                  <Card.Body className="text-center">
                    <h4>{dashboardData?.publishedCourses || 0}</h4>
                    <p className="mb-0">Approved Courses</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="bg-primary text-white">
                  <Card.Body className="text-center">
                    <h4>{dashboardData?.totalCourses || 0}</h4>
                    <p className="mb-0">Total Courses</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Courses Pending Approval
                </h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => {
                    fetchPendingCourses();
                    setActiveTab('courses');
                  }}
                >
                  <i className="fas fa-sync me-1"></i>
                  Refresh
                </Button>
              </Card.Header>
              <Card.Body>
                {pendingCourses.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Instructor</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingCourses.map((course) => (
                        <tr key={course.id}>
                          <td>
                            <strong>{course.title}</strong>
                            <br />
                            <small className="text-muted">{course.courseCode}</small>
                            <br />
                            <small>{course.description?.substring(0, 100)}...</small>
                          </td>
                          <td>
                            {course.instructor?.firstName} {course.instructor?.lastName}
                            <br />
                            <small className="text-muted">{course.instructor?.email}</small>
                          </td>
                          <td>
                            {new Date(course.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(course);
                                  setModalType('approveCourse');
                                  setFormData({ feedback: '' });
                                  setShowModal(true);
                                }}
                              >
                                <i className="fas fa-check me-1"></i>
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(course);
                                  setModalType('rejectCourse');
                                  setFormData({ feedback: '' });
                                  setShowModal(true);
                                }}
                              >
                                <i className="fas fa-times me-1"></i>
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                    <h5>No Pending Courses</h5>
                    <p className="text-muted">All courses have been reviewed!</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </>
        )}

        {/* Enrollment Management Tab */}
        {activeTab === 'enrollments' && (
          <>
            <Row className="mb-4">
              <Col md={3}>
                <Card className="bg-success text-white">
                  <Card.Body className="text-center">
                    <h4>{enrollments.filter(e => e.status === 'ACTIVE').length}</h4>
                    <p className="mb-0">Active Enrollments</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-primary text-white">
                  <Card.Body className="text-center">
                    <h4>{enrollments.filter(e => e.status === 'COMPLETED').length}</h4>
                    <p className="mb-0">Completed</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-warning text-white">
                  <Card.Body className="text-center">
                    <h4>{enrollments.filter(e => e.status === 'PENDING').length}</h4>
                    <p className="mb-0">Pending</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-info text-white">
                  <Card.Body className="text-center">
                    <h4>{enrollments.length}</h4>
                    <p className="mb-0">Total Enrollments</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-users me-2"></i>
                  Student Enrollments
                </h5>
                <div>
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="me-2"
                    onClick={() => {
                      // Generate enrollment report
                      const reportData = {
                        totalEnrollments: enrollments.length,
                        activeEnrollments: enrollments.filter(e => e.status === 'ACTIVE').length,
                        completedEnrollments: enrollments.filter(e => e.status === 'COMPLETED').length,
                        enrollmentsByMonth: {},
                        topCourses: {}
                      };
                      
                      // Process enrollment data for report
                      enrollments.forEach(enrollment => {
                        const month = new Date(enrollment.enrollmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                        reportData.enrollmentsByMonth[month] = (reportData.enrollmentsByMonth[month] || 0) + 1;
                        
                        const courseName = enrollment.course?.title || 'Unknown Course';
                        reportData.topCourses[courseName] = (reportData.topCourses[courseName] || 0) + 1;
                      });
                      
                      // Show report in modal
                      setSelectedItem(reportData);
                      setModalType('enrollmentReport');
                      setShowModal(true);
                    }}
                  >
                    <i className="fas fa-chart-bar me-1"></i>
                    View Report
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={fetchEnrollments}
                  >
                    <i className="fas fa-sync me-1"></i>
                    Refresh
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {enrollments.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Enrollment Date</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Completion Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td>
                            <strong>{enrollment.student?.firstName} {enrollment.student?.lastName}</strong>
                            <br />
                            <small className="text-muted">{enrollment.student?.email}</small>
                          </td>
                          <td>
                            <strong>{enrollment.course?.title}</strong>
                            <br />
                            <small className="text-muted">{enrollment.course?.courseCode}</small>
                          </td>
                          <td>
                            {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                          </td>
                          <td>
                            <Badge bg={
                              enrollment.status === 'ACTIVE' ? 'success' :
                              enrollment.status === 'COMPLETED' ? 'primary' :
                              enrollment.status === 'PENDING' ? 'warning' :
                              enrollment.status === 'CANCELLED' ? 'danger' : 'secondary'
                            }>
                              {enrollment.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="progress" style={{ height: '20px' }}>
                              <div 
                                className="progress-bar" 
                                role="progressbar" 
                                style={{ width: `${enrollment.progress || 0}%` }}
                                aria-valuenow={enrollment.progress || 0} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              >
                                {enrollment.progress || 0}%
                              </div>
                            </div>
                          </td>
                          <td>
                            {enrollment.completionDate ? 
                              new Date(enrollment.completionDate).toLocaleDateString() : 
                              <span className="text-muted">Not completed</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-user-graduate fa-3x text-info mb-3"></i>
                    <h5>No Enrollments Found</h5>
                    <p className="text-muted">Students will appear here when they enroll in courses.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </>
        )}

        {/* Certificate Management Tab */}
        {activeTab === 'certificates' && (
          <>
            <Row className="mb-4">
              <Col md={4}>
                <Card className="bg-warning text-white">
                  <Card.Body className="text-center">
                    <h4>{certificates.length}</h4>
                    <p className="mb-0">Total Certificates</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="bg-success text-white">
                  <Card.Body className="text-center">
                    <h4>{certificates.filter(c => c.status === 'ISSUED').length}</h4>
                    <p className="mb-0">Active Certificates</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="bg-danger text-white">
                  <Card.Body className="text-center">
                    <h4>{certificates.filter(c => c.status === 'REVOKED').length}</h4>
                    <p className="mb-0">Revoked Certificates</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-certificate me-2"></i>
                  Certificate Management
                </h5>
                <div>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => {
                      setModalType('issueCertificate');
                      setFormData({});
                      setShowModal(true);
                    }}
                  >
                    <i className="fas fa-certificate me-1"></i>
                    Issue Certificate
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={fetchCertificates}
                  >
                    <i className="fas fa-sync me-1"></i>
                    Refresh
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {certificates.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Certificate #</th>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Grade</th>
                        <th>Issue Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert) => (
                        <tr key={cert.id}>
                          <td>
                            <code>{cert.certificateNumber}</code>
                          </td>
                          <td>
                            {cert.student?.firstName} {cert.student?.lastName}
                            <br />
                            <small className="text-muted">{cert.student?.email}</small>
                          </td>
                          <td>
                            <strong>{cert.course?.title}</strong>
                            <br />
                            <small className="text-muted">{cert.course?.courseCode}</small>
                          </td>
                          <td>
                            <Badge bg="primary">{cert.grade}</Badge>
                            <br />
                            <small>{cert.score}%</small>
                          </td>
                          <td>
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </td>
                          <td>
                            {getStatusBadge(cert.status)}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                title="View Certificate"
                                onClick={() => {
                                  setSelectedItem(cert);
                                  setModalType('viewCertificate');
                                  setShowModal(true);
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                              {cert.status === 'ISSUED' && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  title="Revoke Certificate"
                                  onClick={() => {
                                    setSelectedItem(cert);
                                    setModalType('revokeCertificate');
                                    setFormData({ revokeReason: '' });
                                    setShowModal(true);
                                  }}
                                >
                                  <i className="fas fa-ban"></i>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-certificate fa-3x text-warning mb-3"></i>
                    <h5>No Certificates Issued</h5>
                    <p className="text-muted">Start by issuing certificates to students who completed courses.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </>
        )}

        {/* Support Requests Tab */}
        {activeTab === 'support' && (
          <>
            <Row className="mb-4">
              <Col md={3}>
                <Card className="bg-danger text-white">
                  <Card.Body className="text-center">
                    <h4>{supportRequests.filter(r => r.status === 'OPEN').length}</h4>
                    <p className="mb-0">Open Requests</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-warning text-white">
                  <Card.Body className="text-center">
                    <h4>{supportRequests.filter(r => r.priority === 'URGENT').length}</h4>
                    <p className="mb-0">Urgent Requests</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-info text-white">
                  <Card.Body className="text-center">
                    <h4>{supportRequests.filter(r => r.status === 'IN_PROGRESS').length}</h4>
                    <p className="mb-0">In Progress</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-success text-white">
                  <Card.Body className="text-center">
                    <h4>{supportRequests.filter(r => r.status === 'RESOLVED').length}</h4>
                    <p className="mb-0">Resolved</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-life-ring me-2"></i>
                  Support Requests
                </h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={fetchSupportRequests}
                >
                  <i className="fas fa-sync me-1"></i>
                  Refresh
                </Button>
              </Card.Header>
              <Card.Body>
                {supportRequests.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Request</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportRequests.map((request) => (
                        <tr key={request.id}>
                          <td>
                            <strong>{request.subject}</strong>
                            <br />
                            <small className="text-muted">
                              {request.description?.substring(0, 100)}...
                            </small>
                          </td>
                          <td>
                            {request.user?.firstName} {request.user?.lastName}
                            <br />
                            <small className="text-muted">{request.user?.email}</small>
                          </td>
                          <td>
                            <Badge bg="secondary">
                              {request.type?.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={
                              request.priority === 'URGENT' ? 'danger' :
                              request.priority === 'HIGH' ? 'warning' :
                              request.priority === 'MEDIUM' ? 'info' : 'secondary'
                            }>
                              {request.priority}
                            </Badge>
                          </td>
                          <td>
                            {getStatusBadge(request.status)}
                          </td>
                          <td>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                              {request.status === 'OPEN' && (
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  title="Assign to Me"
                                >
                                  <i className="fas fa-user-check"></i>
                                </Button>
                              )}
                              {request.status === 'IN_PROGRESS' && (
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  title="Add Response"
                                >
                                  <i className="fas fa-reply"></i>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-life-ring fa-3x text-info mb-3"></i>
                    <h5>No Support Requests</h5>
                    <p className="text-muted">All support requests have been handled!</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </>
        )}

        {/* Alert */}
        {alert.show && (
          <Alert 
            variant={alert.type} 
            className="position-fixed" 
            style={{ top: '20px', right: '20px', zIndex: 9999 }}
            dismissible 
            onClose={() => setAlert({ show: false, message: '', type: '' })}
          >
            {alert.message}
          </Alert>
        )}

        {/* Universal Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'createAdmin' && 'Create New Admin'}
              {modalType === 'approveCourse' && 'Approve Course'}
              {modalType === 'rejectCourse' && 'Reject Course'}
              {modalType === 'issueCertificate' && 'Issue Certificate'}
              {modalType === 'enrollmentReport' && 'Enrollment Report'}
              {modalType === 'viewAllAdmins' && 'All Administrator Accounts'}
              {modalType === 'revokeCertificate' && 'Revoke Certificate'}
              {modalType === 'viewCertificate' && 'Certificate Details'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Create Admin Form */}
            {modalType === 'createAdmin' && (
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.username || ''}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        placeholder="Enter username"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Enter password"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter full name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Enter department"
                    required
                  />
                </Form.Group>
              </Form>
            )}

            {/* Course Approval/Rejection Form */}
            {(modalType === 'approveCourse' || modalType === 'rejectCourse') && selectedItem && (
              <div>
                <div className="mb-3">
                  <h6>Course Details:</h6>
                  <p><strong>Title:</strong> {selectedItem.title}</p>
                  <p><strong>Code:</strong> {selectedItem.courseCode}</p>
                  <p><strong>Instructor:</strong> {selectedItem.instructor?.firstName} {selectedItem.instructor?.lastName}</p>
                  <p><strong>Description:</strong> {selectedItem.description}</p>
                </div>
                <Form.Group>
                  <Form.Label>
                    {modalType === 'approveCourse' ? 'Approval Comments (Optional)' : 'Rejection Reason (Required)'}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.feedback || ''}
                    onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                    placeholder={modalType === 'approveCourse' ? 'Enter approval comments...' : 'Enter reason for rejection...'}
                    required={modalType === 'rejectCourse'}
                  />
                </Form.Group>
              </div>
            )}

            {/* Issue Certificate Form */}
            {modalType === 'issueCertificate' && (
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Student ID</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.studentId || ''}
                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                        placeholder="Enter student ID"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course ID</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.courseId || ''}
                        onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                        placeholder="Enter course ID"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Grade</Form.Label>
                      <Form.Select
                        value={formData.grade || ''}
                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                        required
                      >
                        <option value="">Select Grade</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="Pass">Pass</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Score (%)</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max="100"
                        value={formData.score || ''}
                        onChange={(e) => setFormData({...formData, score: e.target.value})}
                        placeholder="Enter score"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}

            {/* Enrollment Report */}
            {modalType === 'enrollmentReport' && selectedItem && (
              <div>
                <Row className="mb-4">
                  <Col md={3}>
                    <Card className="bg-primary text-white">
                      <Card.Body className="text-center">
                        <h4>{selectedItem.totalEnrollments}</h4>
                        <p className="mb-0">Total Enrollments</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="bg-success text-white">
                      <Card.Body className="text-center">
                        <h4>{selectedItem.activeEnrollments}</h4>
                        <p className="mb-0">Active</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="bg-info text-white">
                      <Card.Body className="text-center">
                        <h4>{selectedItem.completedEnrollments}</h4>
                        <p className="mb-0">Completed</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="bg-warning text-white">
                      <Card.Body className="text-center">
                        <h4>{Math.round((selectedItem.completedEnrollments / selectedItem.totalEnrollments) * 100) || 0}%</h4>
                        <p className="mb-0">Completion Rate</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">Enrollments by Month</h6>
                      </Card.Header>
                      <Card.Body>
                        {Object.keys(selectedItem.enrollmentsByMonth).length > 0 ? (
                          <div>
                            {Object.entries(selectedItem.enrollmentsByMonth).map(([month, count]) => (
                              <div key={month} className="d-flex justify-content-between mb-2">
                                <span>{month}</span>
                                <Badge bg="primary">{count}</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted">No enrollment data available</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">Top Courses by Enrollment</h6>
                      </Card.Header>
                      <Card.Body>
                        {Object.keys(selectedItem.topCourses).length > 0 ? (
                          <div>
                            {Object.entries(selectedItem.topCourses)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 5)
                              .map(([course, count]) => (
                              <div key={course} className="d-flex justify-content-between mb-2">
                                <span className="text-truncate" title={course}>{course}</span>
                                <Badge bg="success">{count}</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted">No course data available</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {/* View All Admins */}
            {modalType === 'viewAllAdmins' && (
              <div>
                <div className="mb-3">
                  <p className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Administrator accounts with system access. Only admins can create other admin accounts.
                  </p>
                </div>
                
                {allAdmins.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Admin Details</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Last Login</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAdmins.map((admin) => (
                        <tr key={admin.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <div 
                                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                  style={{ width: '40px', height: '40px' }}
                                >
                                  <i className="fas fa-user-shield"></i>
                                </div>
                              </div>
                              <div>
                                <strong>{admin.fullName}</strong>
                                <br />
                                <small className="text-muted">@{admin.username}</small>
                                <br />
                                <small className="text-muted">{admin.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="secondary">{admin.department}</Badge>
                          </td>
                          <td>
                            <Badge bg={admin.isActive ? 'success' : 'danger'}>
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            {admin.lastLogin ? 
                              new Date(admin.lastLogin).toLocaleDateString() : 
                              <span className="text-muted">Never</span>
                            }
                          </td>
                          <td>
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                title="Edit Admin"
                                disabled={admin.id === adminData?.id}
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                title="Reset Password"
                                disabled={admin.id === adminData?.id}
                              >
                                <i className="fas fa-key"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                title="Deactivate"
                                disabled={admin.id === adminData?.id || !admin.isActive}
                              >
                                <i className="fas fa-ban"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-user-shield fa-3x text-primary mb-3"></i>
                    <h5>No Administrators Found</h5>
                    <p className="text-muted">No admin accounts are available to display.</p>
                  </div>
                )}
                
                <div className="mt-3 p-3 bg-light rounded">
                  <h6 className="mb-2">
                    <i className="fas fa-chart-pie me-1"></i>
                    Admin Statistics
                  </h6>
                  <Row>
                    <Col md={3}>
                      <div className="text-center">
                        <h5 className="text-primary">{allAdmins.length}</h5>
                        <small className="text-muted">Total Admins</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <h5 className="text-success">{allAdmins.filter(a => a.isActive).length}</h5>
                        <small className="text-muted">Active</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <h5 className="text-danger">{allAdmins.filter(a => !a.isActive).length}</h5>
                        <small className="text-muted">Inactive</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <h5 className="text-info">{allAdmins.filter(a => a.lastLogin).length}</h5>
                        <small className="text-muted">Ever Logged In</small>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {/* Revoke Certificate Form */}
            {modalType === 'revokeCertificate' && selectedItem && (
              <div>
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Warning:</strong> This action will permanently revoke the certificate. This cannot be undone.
                </div>
                
                <div className="mb-4">
                  <h6>Certificate Details:</h6>
                  <div className="bg-light p-3 rounded">
                    <Row>
                      <Col md={6}>
                        <p><strong>Certificate #:</strong> <code>{selectedItem.certificateNumber}</code></p>
                        <p><strong>Student:</strong> {selectedItem.student?.firstName} {selectedItem.student?.lastName}</p>
                        <p><strong>Email:</strong> {selectedItem.student?.email}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Course:</strong> {selectedItem.course?.title}</p>
                        <p><strong>Grade:</strong> <Badge bg="primary">{selectedItem.grade}</Badge> ({selectedItem.score}%)</p>
                        <p><strong>Issue Date:</strong> {new Date(selectedItem.issueDate).toLocaleDateString()}</p>
                      </Col>
                    </Row>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-comment me-1"></i>
                    Reason for Revocation <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.revokeReason || ''}
                    onChange={(e) => setFormData({...formData, revokeReason: e.target.value})}
                    placeholder="Please provide a detailed reason for revoking this certificate..."
                    required
                  />
                  <Form.Text className="text-muted">
                    This reason will be recorded in the system logs and may be visible to the student.
                  </Form.Text>
                </Form.Group>

                <div className="bg-danger bg-opacity-10 border border-danger rounded p-3">
                  <h6 className="text-danger mb-2">
                    <i className="fas fa-ban me-1"></i>
                    Revocation Effects:
                  </h6>
                  <ul className="text-danger mb-0">
                    <li>Certificate will be marked as <strong>REVOKED</strong></li>
                    <li>Student will lose access to certificate verification</li>
                    <li>Certificate will no longer be valid for employment/academic purposes</li>
                    <li>This action is permanent and cannot be reversed</li>
                  </ul>
                </div>
              </div>
            )}

            {/* View Certificate Details */}
            {modalType === 'viewCertificate' && selectedItem && (
              <div>
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 border border-primary rounded p-4">
                    <i className="fas fa-certificate fa-4x text-primary mb-3"></i>
                    <h4 className="text-primary mb-2">Digital Certificate</h4>
                    <h5 className="mb-0">Certificate #{selectedItem.certificateNumber}</h5>
                  </div>
                </div>

                <Row className="mb-4">
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Header>
                        <h6 className="mb-0">
                          <i className="fas fa-user-graduate me-1"></i>
                          Student Information
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Name:</strong> {selectedItem.student?.firstName} {selectedItem.student?.lastName}</p>
                        <p><strong>Email:</strong> {selectedItem.student?.email}</p>
                        <p><strong>Student ID:</strong> {selectedItem.student?.id}</p>
                        <p className="mb-0"><strong>Role:</strong> <Badge bg="info">{selectedItem.student?.role}</Badge></p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Header>
                        <h6 className="mb-0">
                          <i className="fas fa-book me-1"></i>
                          Course Information
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Course:</strong> {selectedItem.course?.title}</p>
                        <p><strong>Course Code:</strong> <code>{selectedItem.course?.courseCode}</code></p>
                        <p><strong>Credit Hours:</strong> {selectedItem.course?.creditHours}</p>
                        <p className="mb-0"><strong>Instructor:</strong> {selectedItem.course?.instructor?.firstName} {selectedItem.course?.instructor?.lastName}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Card className="text-center bg-success bg-opacity-10 border-success">
                      <Card.Body>
                        <h3 className="text-success mb-1">{selectedItem.grade}</h3>
                        <p className="text-success mb-0">Final Grade</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center bg-primary bg-opacity-10 border-primary">
                      <Card.Body>
                        <h3 className="text-primary mb-1">{selectedItem.score}%</h3>
                        <p className="text-primary mb-0">Final Score</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center bg-info bg-opacity-10 border-info">
                      <Card.Body>
                        <h3 className="text-info mb-1">
                          <Badge bg={selectedItem.status === 'ISSUED' ? 'success' : selectedItem.status === 'REVOKED' ? 'danger' : 'warning'}>
                            {selectedItem.status}
                          </Badge>
                        </h3>
                        <p className="text-info mb-0">Status</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <i className="fas fa-info-circle me-1"></i>
                      Certificate Timeline
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="timeline">
                      <div className="d-flex justify-content-between mb-2">
                        <span><strong>Issue Date:</strong></span>
                        <span>{new Date(selectedItem.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span><strong>Completion Date:</strong></span>
                        <span>{selectedItem.completionDate ? new Date(selectedItem.completionDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span><strong>Created:</strong></span>
                        <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span><strong>Last Updated:</strong></span>
                        <span>{new Date(selectedItem.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {selectedItem.notes && (
                  <Card className="mt-3">
                    <Card.Header>
                      <h6 className="mb-0">
                        <i className="fas fa-sticky-note me-1"></i>
                        Notes
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-0">{selectedItem.notes}</p>
                    </Card.Body>
                  </Card>
                )}

                {selectedItem.status === 'REVOKED' && (
                  <div className="alert alert-danger mt-3">
                    <i className="fas fa-ban me-2"></i>
                    <strong>Certificate Revoked:</strong> This certificate has been permanently revoked and is no longer valid.
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            {modalType === 'createAdmin' && (
              <Button variant="primary" onClick={handleCreateAdmin}>
                <i className="fas fa-user-plus me-1"></i>
                Create Admin
              </Button>
            )}
            {modalType === 'approveCourse' && (
              <Button variant="success" onClick={() => handleApproveCourse(selectedItem.id)}>
                <i className="fas fa-check me-1"></i>
                Approve Course
              </Button>
            )}
            {modalType === 'rejectCourse' && (
              <Button variant="danger" onClick={() => handleRejectCourse(selectedItem.id)}>
                <i className="fas fa-times me-1"></i>
                Reject Course
              </Button>
            )}
            {modalType === 'issueCertificate' && (
              <Button variant="warning" onClick={handleIssueCertificate}>
                <i className="fas fa-certificate me-1"></i>
                Issue Certificate
              </Button>
            )}
            {modalType === 'enrollmentReport' && (
              <Button variant="primary" onClick={() => setShowModal(false)}>
                <i className="fas fa-times me-1"></i>
                Close Report
              </Button>
            )}
            {modalType === 'viewAllAdmins' && (
              <Button variant="primary" onClick={() => setShowModal(false)}>
                <i className="fas fa-times me-1"></i>
                Close
              </Button>
            )}
            {modalType === 'revokeCertificate' && (
              <Button 
                variant="danger" 
                onClick={() => handleRevokeCertificate(selectedItem.id)}
                disabled={!formData.revokeReason || formData.revokeReason.trim().length < 10}
              >
                <i className="fas fa-ban me-1"></i>
                Revoke Certificate
              </Button>
            )}
            {modalType === 'viewCertificate' && (
              <Button variant="primary" onClick={() => setShowModal(false)}>
                <i className="fas fa-times me-1"></i>
                Close
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default AdminDashboard;
