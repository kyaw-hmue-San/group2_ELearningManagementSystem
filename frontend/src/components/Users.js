import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Form, InputGroup } from 'react-bootstrap';
import { apiService } from '../services/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByRole = async (role) => {
    try {
      let response;
      if (role === 'INSTRUCTOR') {
        response = await apiService.getInstructors();
      } else if (role === 'STUDENT') {
        response = await apiService.getStudents();
      } else {
        response = await apiService.getUsers();
      }
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users by role:', error);
    }
  };

  const handleRoleFilter = (role) => {
    setFilterRole(role);
    fetchUsersByRole(role);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'ADMIN': { bg: 'danger', text: 'Admin' },
      'INSTRUCTOR': { bg: 'warning', text: 'Instructor' },
      'STUDENT': { bg: 'info', text: 'Student' }
    };
    
    const config = roleConfig[role] || { bg: 'secondary', text: role };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="loading">
          <i className="fas fa-spinner fa-spin fa-2x"></i>
          <p>Loading users...</p>
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
                <i className="fas fa-users me-2"></i>
                Users
              </h2>
              <p className="text-muted">Manage system users and their roles</p>
            </div>
            <Button variant="primary">
              <i className="fas fa-user-plus me-2"></i>
              Add User
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filter Buttons */}
      <Row className="mb-4">
        <Col lg={12}>
          <div className="d-flex gap-2 flex-wrap">
            <Button 
              variant={filterRole === 'ALL' ? 'primary' : 'outline-primary'}
              onClick={() => handleRoleFilter('ALL')}
            >
              All Users ({users.length})
            </Button>
            <Button 
              variant={filterRole === 'STUDENT' ? 'info' : 'outline-info'}
              onClick={() => handleRoleFilter('STUDENT')}
            >
              Students
            </Button>
            <Button 
              variant={filterRole === 'INSTRUCTOR' ? 'warning' : 'outline-warning'}
              onClick={() => handleRoleFilter('INSTRUCTOR')}
            >
              Instructors
            </Button>
            <Button 
              variant={filterRole === 'ADMIN' ? 'danger' : 'outline-danger'}
              onClick={() => handleRoleFilter('ADMIN')}
            >
              Admins
            </Button>
          </div>
        </Col>
      </Row>

      {/* Users Table */}
      {users.length > 0 ? (
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  User List
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <div>
                            <strong>{user.firstName} {user.lastName}</strong>
                          </div>
                        </td>
                        <td>
                          <code>@{user.username}</code>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          {getRoleBadge(user.role)}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col lg={12} className="text-center py-5">
            <i className="fas fa-users fa-3x text-muted mb-3"></i>
            <h4>No users found</h4>
            <p className="text-muted">
              {filterRole !== 'ALL' 
                ? `No users with role ${filterRole} found` 
                : 'No users are available at the moment'}
            </p>
            <Button variant="primary">
              <i className="fas fa-user-plus me-2"></i>
              Add First User
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Users;
