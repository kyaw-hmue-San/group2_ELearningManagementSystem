# Team Workflow Guide

## 🎯 Repository Structure

```
elearning/
├── src/                    # Spring Boot Backend
├── frontend/              # React Frontend  
├── docs/                  # Documentation
├── docker-compose.yml     # Development setup
└── README.md             # Project overview
```

## 👥 Team Collaboration

### Branch Strategy
```bash
main                    # Production ready code
├── develop            # Integration branch
├── feature/backend-*  # Backend features
├── feature/frontend-* # Frontend features
└── hotfix/*          # Bug fixes
```

### Workflow
1. **Create feature branch** from develop
2. **Work on your part** (frontend or backend)
3. **Test locally** with full stack
4. **Create Pull Request** to develop
5. **Team review** and merge

### Commit Messages
```bash
# Backend commits
git commit -m "backend: add user authentication API"
git commit -m "backend: fix course enrollment bug"

# Frontend commits  
git commit -m "frontend: add course listing page"
git commit -m "frontend: improve dashboard UI"

# Full-stack commits
git commit -m "feat: complete user registration flow"
```

## 🚀 Development Setup

### Backend Developer:
```bash
# Start database
docker-compose up -d mysql

# Run Spring Boot
./mvnw spring-boot:run
```

### Frontend Developer:
```bash
# Start backend first (or use mock data)
./mvnw spring-boot:run

# Start React
cd frontend && npm start
```

### Full Stack Testing:
```bash
# Start everything
docker-compose up -d mysql
./mvnw spring-boot:run &
cd frontend && npm start
```

## 📋 Team Responsibilities

### Backend Team:
- REST API endpoints
- Database design
- Business logic
- Authentication
- Testing backend

### Frontend Team:
- React components
- UI/UX design
- API integration
- Responsive design
- Testing frontend

### Shared:
- Documentation
- Deployment
- Integration testing
- Code reviews
