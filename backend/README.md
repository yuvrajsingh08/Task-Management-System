# Task Management System - Backend

A complete RESTful API backend for the Task Management System built with Node.js, Express, and MongoDB.

## Features

- User Authentication (JWT-based)
- Task Management (CRUD operations)
- Project Management (CRUD operations)
- Employee Management (CRUD operations)
- Attendance Tracking
- Timesheet Management
- Dashboard Statistics
- MongoDB Database
- RESTful API Design

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET_KEY=your-secret-key-here
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npx nodemon app.js
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/task/:id` - Get task by ID
- `GET /api/tasks/employee/:employeeId` - Get tasks by employee
- `GET /api/tasks/project/:projectId` - Get tasks by project
- `POST /api/task` - Create new task
- `PUT /api/task/:id` - Update task
- `DELETE /api/task/:id` - Delete task

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/stats` - Get project statistics
- `GET /api/project/:id` - Get project by ID
- `POST /api/project` - Create new project
- `PUT /api/project/:id` - Update project
- `DELETE /api/project/:id` - Delete project

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/stats` - Get employee statistics
- `GET /api/employee/:id` - Get employee by ID
- `POST /api/employee` - Create new employee
- `PUT /api/employee/:id` - Update employee
- `DELETE /api/employee/:id` - Delete employee

### Attendance
- `GET /api/attendances` - Get all attendance records
- `GET /api/attendances/employee/:employeeId` - Get attendance by employee
- `GET /api/attendances/day/:day` - Get attendance by day
- `POST /api/attendance` - Mark attendance

### Timesheets
- `GET /api/timesheets` - Get all timesheets
- `GET /api/timesheets/stats` - Get timesheet statistics
- `GET /api/timesheet/:id` - Get timesheet by ID
- `GET /api/timesheets/employee/:employeeId` - Get timesheets by employee
- `POST /api/timesheet` - Create new timesheet
- `PUT /api/timesheet/:id` - Update timesheet
- `DELETE /api/timesheet/:id` - Delete timesheet

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Models

### User
- firstName, lastName, email, password, role

### Task
- title, description, assignTo (Employee), project (Project), startDate, endDate, priority, status

### Project
- title, description, clientName, startDate, endDate, status, priority

### Employee
- employee_id, firstName, lastName, email, phone, role, status, gender, dateOfBirth, startDate, residentialAddress

### Attendance
- employee (Employee), day, timeIn, timeOut, workingHours

### Timesheet
- employee (Employee), project (Project), task (Task), date, timeSpent, progress, notes, type

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

