# System Design
## Introduction
Our capstone project involves creating a web application that helps educational institutions with automated grading and assignment management. The system's main users are teachers, teaching assistants, students, and administrators. The application aims to improve grading efficiency by streamlining the grading process and giving students valuable feedback. 

The system is designed to offer the following high-level functionalities:
* **Teachers:** Create and manage course assignments, provide detailed grading rubrics, and get AI-supported grading recommendations.
* **Teaching Assistants:** Assist in the grading process by validating grades produced by AI, and offer feedback to help with the grading process. 
* **Students:** Turn in assignments and get thorough feedback on their performance, which will help them identify their areas of strength and improvement.
* **Administrators:** Keep an eye on user permissions, oversee system operations, and make sure the application runs smoothly


## System Architecture Design
The system architecture design used a microservice architecture pattern due to its flexibility and scalability in development and deployment. Because each component is contained in its own Docker container, maintenance is improved and independent upgrades are possible.

![Alt text](https://github.com/UBCO-COSC499-Summer-2024/team-11-capstone-devmaker/blob/System-Architecture-Design/docs/design/System_Architecture_Design.png)

Components:
* **Node.js (Backend):** The core system component that facilitates communication amongst the system’s other services. It manages front-end request processing, and business logic handling, and coordinates with other microservices
* **MySQL (Database):** Data storage is managed by this component. The backend requests CRUD operations, which the MySQL API then handles as an interface with the database.
* **Ollama (Artificial Intelligence):** The AI-based grading processes are managed by this component. It provides automated grading and feedback based on set rubrics by processing grading requests from the backend.
* **React View (Front End):** The front-end component is separated into smaller parts for the Teacher/TA, Student, and Admin views. This will be developed using React and Material UI. This component interacts with the backend to present user interfaces and collect user input.
* **OAuth 2.0 (Authentication):** This component oversees permission and authentication, guaranteeing safe access control across the system. It supports OAuth 2.0 protocols and interfaces with the backend. 
* **Docker Containers:** Every service in the system is contained using Docker containers, which offer a consistent and isolated runtime environment. This method improves maintainability and scalability by guaranteeing that every service can operate independently.
