# Group 2 E-Learning Management System

A comprehensive e-learning management system built with Spring Boot and MySQL for university coursework.

## 🚀 Features

- **User Management**: Student and instructor registration/authentication
- **Course Management**: Create, manage, and enroll in courses
- **Content Delivery**: Upload and manage learning materials
- **Assessment System**: Quizzes, assignments, and grading
- **Progress Tracking**: Monitor student learning progress

## 🛠️ Technology Stack

- **Backend**: Spring Boot 3.5.6, Java 17
- **Database**: MySQL 8.0 (Docker)
- **Build Tool**: Maven
- **Containerization**: Docker & Docker Compose
- **Database Management**: phpMyAdmin

## 📋 Prerequisites

- Java 17 or higher
- Docker Desktop
- Maven 3.6+
- Git

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/kyaw-hmue-San/group2_ELearningManagementSystem.git
cd group2_ELearningManagementSystem
```

### 2. Start the database
```bash
docker-compose up -d
```

### 3. Run the application
```bash
./mvnw spring-boot:run
```

### 4. Access the application
- **Application**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081
  - Username: `root`
  - Password: `elearning123`

## 📁 Project Structure

```
elearning/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── mfuelearning/elearning/
│   │   └── resources/
│   │       └── application.properties
├── docker-compose.yml
├── init.sql
├── pom.xml
└── README.md
```

## 🗄️ Database Configuration

The project uses MySQL with the following default settings:
- **Database**: `elearning_db`
- **Username**: `elearning_user`
- **Password**: `elearning_pass`
- **Port**: `3306`

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs

# Restart containers
docker-compose restart
```

## 👥 Team Members

- Group 2 - Web Application Development
- University Project

## 📝 License

This project is created for educational purposes as part of university coursework.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please contact the development team or create an issue in the repository.
