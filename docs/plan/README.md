# Project Proposal for Optical Marking Management System
***
Date: May 29, 2024
### Team 5
### Members:
- Nathan Jacinto - 62151279
- Oakley Pankratz - 35649318
- Nic Kouwenhoven - 60504180
- Jay Bhullar - 21474457
- Jack Mathisen - 73490252
***
# 1. Overview
***
### 1.1 Project Description and Purpose
#### Project Description:
The Optical Marking Management System (OMMS) is designed as a responsive web application to support the full lifecycle of optically marked exams. This includes rapid construction, automated marking, detailed analysis, and efficient return of results. By automating these processes, OMMS aims to enhance accuracy and efficiency, reducing the administrative burden on instructors and ensuring a consistent assessment experience for students.

#### Unique Value Proposition:
Our software stands out by significantly reducing the time and effort required by instructors in the exam creation and marking process. We focus on an instructor-first approach, ensuring that every feature is designed to enhance their experience. Key differentiators include:
Exam Duplication: Easily duplicate exams to streamline the creation of similar assessments.
Per-Question Historical Analysis: Track and analyze student performance on individual questions over time to identify trends and areas for improvement.
Error Prevention: Implement robust error prevention mechanisms to ensure accuracy in exam marking.
PDF Ingestion: Unlike traditional OMR systems that require specific scans, our software can ingest standard PDFs, providing greater flexibility and ease of use for instructors.
Easy-to-Use Interface: Our interface will adhere to the glance-looking principle, ensuring that instructors can quickly and easily understand and navigate the software, perform tasks efficiently, and benefit from features that streamline their workflow.
Scalability and Performance: Our software will be capable of handling large files, including those up to 1000 pages PDF, and accurately marking them, ensuring that even extensive assessments are processed quickly and efficiently
These features make our software more convenient and efficient than existing OMR solutions, providing a superior user experience through ease of use, a better user interface, time-saving capabilities, enhanced accuracy, and greater flexibility for instructors.


#### Project Goals and Scope:
Our primary objective is to develop a Minimal Viable Product of the OMMS that encompasses essential features needed by instructors, students, and administrators. These features are designed to meet specific, measurable, achievable, relevant, and time-bound (SMART) criteria. Our goals are:
Responsive Interface: Develop a fully responsive web application that adapts to desktop and mobile devices, ensuring it passes WCAG 2.1 accessibility tests, using responsive design techniques and accessibility best practices.
User Authentication: Implement a secure login system and user management for instructors, students, and administrators, ensuring it passes security vulnerability tests and verifies role-specific functionalities.
Exam Creation and Duplication: Provide tools for instructors to create and duplicate exams easily, utilizing best practices in UX/UI design .
Automated Marking: Develop an automated system for marking optically marked exams, ensuring at least 98% accuracy in marking tests using reliable OMR technology,
Detailed Analysis: Provide comprehensive tools for analyzing exam results, including per-question performance and historical data using advanced data analytics techniques.
Error Handling: Implement robust mechanisms to prevent and manage errors during the marking process, using validation checks and error handling protocol.
Scalability and Performance: Our software is capable of handling large files, including those up to 1000 pages, and accurately marking them, ensuring that even extensive assessments are processed quickly and efficiently
By focusing on these core functionalities, our goal is to deliver a product that significantly enhances the exam management process, ultimately improving the overall efficiency and effectiveness of academic assessments. The specific goals are detailed as requirements in Section 2.

### 1.2 User Groups:
##### a. Instructors:
&nbsp; &nbsp; Instructors are the primary users responsible for managing and overseeing courses, tests, and student performance. Their responsibilities include creating and administering examinations, grading, and analyzing student performance data. Instructors use the system to facilitate these tasks efficiently, allowing them to focus more on teaching and less on administrative work. 
Examples: Professors, Teaching Assistants, Teachers

##### b. Students:
&nbsp; &nbsp; Students are other primary users who interact with the system primarily to view their academic progress and test performance. Their role is more focused on accessing information rather than managing or inputting data.
Examples: Undergraduate and Graduate Students

##### c. Administrators
&nbsp; &nbsp; Administrators are responsible for the overall management and operation of the educational institution’s systems and processes.
Examples: Department Heads, It Support

### 1.3 Usage Scenarios
Use case scenarios illustrate the interaction between users (Instructors, Students, and Administrators) and the Optical Marking Management System, detailing the steps involved in common tasks to ensure smooth operation and user satisfaction.

This is explained in detail in the [use cases](useCases.md)

# 2. Requirements
***
### 2.1 Functional Requirements
##### a. User Account Creation and Management
- The user has to be able to login
- The user has to be able to logout
- The user has to be able to recover the password
- The admin must be able to assign roles (instructor, administrator, student)

##### b. Exam Management
- Exams have to be able to be created
- Exams have to be able to be uploaded (as PDFs)
- Exams have to be able to be marked
- Instructors must be able to view historical analysis
- Instructors must be able to download a report on their analysis

##### c. Student Interaction
- Students must be able to view the results of the exam, if allowed
- Students must be able to view their grades on mobile

### 2.2 Non-Functional Requirements
##### a. Security
- Data Protection: Adherence to University privacy regulations and guidelines to ensure student data protection.
- Secure Authentication: Modular authentication to allow for University integration.

##### b. Performance
- Connection Load: System capable of handling thousands of students without major performance degradation.
- Scalability: Utilize microservices architecture to ensure good scalability and ease of maintenance.
- Optimization: Automatic data entry and quick glance reporting/analytics to minimize additional work for instructors.

##### c. Usability
- User-Friendly Interface: HCI design followed: Affordance, Recognition, Simplicity, and documentation prioritized for effective UI/UX design.
- Streamlined Onboarding: Minimal interaction is required for instructors with efficient onboarding and recall processes.

##### d. Maintainability
- Database Design: Flexible database design to support new exams or formats of bubble sheets.
- System Updates: Easy to update and maintain the system with minimal downtime.

##### e. Accessibility
- Must adhere to WCAG 2.2  Level AA Standard
https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

### 2.3 User Requirements
##### a. Instructors
- View a dashboard of all courses they have taught.
- Upload a CSV student roster for their course to avoid manually inputting each student.
- Create tests/examination modules.
- Select weights for different questions in an examination.
- Set the correct answers for each multiple-choice question on an examination.
- Upload 1000pg PDFs containing scans of bubble sheets for multiple choice questions, or input/edit multiple choice grades manually.
- Choose to upload one document for the entire class or a separate document for each student.
- Correct errors by re-uploading specific sheets that caused the error, rather than the entire document.
- Decide if students can view correct responses and their own responses.
- View test statistics (five-number summary).
- View a breakdown of the grades for all students in a course, in a single place.
- View and edit the response of any particular student on multiple-choice questions for a given upload.
- View the percentage of students who selected each response for a multiple-choice question.
- Add/remove questions from the multiple choice section of an examination at any point within the time interval.
- Remove exams at any point within the time interval.
- Edit a specific student’s grade on an exam.
- Edit a specific student’s overall grade in a course.
- View historical courses, examinations, and question grades.
- Compare historical grade averages across a range of years.
- Compare grades for different years side-by-side.

##### b. Students
- View a dashboard of all courses they have taken.
- View the correct answer compared with their answer if the instructor enables it (you answered A, the correct answer was B).
- View the overall grade for their test.
- View the overall grade for their course’s tests.

##### c. Administrator
- User Management
    - Add, edit or delete a useer
    - Assign roles and permissions to aa user
    - Reset passwords and handle account recovery

### 2.4 System Requirements
- The system’s UI will work via mobile browser or web browser (web app)
- The system will store uploaded bubble sheets.
- The system will identify, locate, and report errors in uploaded bubble sheets. 
- The system will automatically correct the orientation of bubble sheets.
- In an upload,  the system will identify which student each individual sheet belongs to.
- The system will automatically mark uploaded bubble sheets. For each question, it will identify the student’s response, and compare it to the correct response. 
- The system will verify that an upload matches the course for which it is being uploaded to.
- The system will store different courses and tests.
- The system will store the grades for each student in a course.
- The system will compute a weighted average of grades for a particular student's performance in a course, best on their grades on each assessment.

### 2.5 Technical Requirements
- Database: Use PostgreSQL for reliable and efficient data storage and management.
- APIs: Develop RESTful APIs for communication between front-end and back-end services.
- Authentication: Implement authentication using an external authentication service to ensure our system is modular, allowing authentication systems (CWL) to be easily implemented in the future.
- Containerization: Utilize docker for easy production/test environments and scalability with microservices architecture.
- Backup: Regular automated backups of the database to prevent data loss.
- Deployment: Utilize CI/CD pipelines for automated testing and deployment.
- Testing: Utilize test-driven development (TDD) with unit, integration, and end-to-end regression testing to ensure adherence to user requirements at all times. 
- Error Handling: Implement robust error handling and logging mechanisms to identify and troubleshoot issues.
- Performance: Optimize the application for performance to handle high volumes of concurrent users.
- AI Integration: Implement YOLOv3 for object detection to assist with optical mark recognition.
- Data Visualization: Use Tableau to create interactive and insightful dashboards for data analysis.
- Proper Licensing and Use of Software Tools

### 2.6 Constraints and Assumptions
##### a. Constraints
- Time: The project must be completed within the specified deadlines for each milestone.
- Resources: Limited availability of team members and technical resources may impact the project's progress.
##### b. Assumptions
- User Engagement: Assumes active participation and feedback from instructors, students, and administrators.
- Technical Infrastructure: Assumes the availability of necessary technical infrastructure, including servers and network resources.
- Data Quality: Assumes that the data provided for testing and production will be accurate and clean.
- Internet Access is assumed.

# 3. Tech Stack 
***
### 3.1 Front End

 - React.js:
     - Description: React.js is a popular JavaScript library for building user interfaces, especially single-page applications where real-time updates are crucial. It allows for creating reusable UI components.
     - Why: It's highly performant, has a vast ecosystem, and integrates well with other tools and libraries
 - Bootstrap:
     - Description: Bootstrap is a front-end framework for developing responsive and mobile-first websites.
     - Why: It provides a wide range of pre-designed components and responsive grid layouts, speeding up the development process.
 - Figma:
     - Description: Figma is a cloud-based design tool used for UI/UX design.
     - Why: It allows for collaborative design work, prototyping, and user feedback, ensuring the design process is streamlined and efficient.

### 3.2 Backend:

 - PostgreSQL:
     - Description: PostgreSQL is a powerful, open-source object-relational database system.
     - Why: It is highly reliable, supports advanced data types, and provides robust performance, making it suitable for handling complex queries and large datasets.
 - Node.js / Express.js
     - Description: Node.js is a Javascript runtime environment, with Express.js being a framework on top of Node. Express allows for easy routing and API creation.
     - Why: React.js is a javascript framework, and it made sense to use a simple and widely used javascript backend that will allow for us to work efficiently

### 3.3 Data Analysis:

 - Tableau
     - Description: Tableau is a leading data visualization tool that helps in transforming data into actionable insights.
     - Why: It is user-friendly, supports real-time data analytics, and provides powerful visualization capabilities, aiding in the analysis of exam data.

### 3.4 Version Control an Collaboration:

 - GitHub
     - Description: GitHub is a web-based platform used for version control and collaborative software development.
     - Why: It facilitates team collaboration, version tracking, code reviews, and continuous integration/continuous deployment (CI/CD) workflows.
 - Discord
     - Description: Discord is a VoIP, instant messaging, and digital distribution platform designed for creating communities ranging from gamers to education and business.
     - Why: It enables real-time communication through text, voice, and video, supports file sharing, and offers integrations with various tools and services, making it ideal for team collaboration, community building, and managing virtual events.

### 3.5 Additional Tools and Services: 

 - Docker
     - Description: Docker is a set of platform-as-a-service products that use OS-level virtualization to deliver software in packages called containers.
     - Why: It helps in creating consistent development, testing, and production environments, ensuring the application runs smoothly across different environments.aa
 - YOLOv3
     - Description: YOLOv3 is an advanced deep-learning model for object detection. It is designed to detect objects within an image or video in a single forward pass, making it extremely fast compared to other object detection models like R-CNN, Fast R-CNN, and Faster R-CNN.
     - Why: YOLOv3's blend of speed, accuracy, and simplicity makes it an excellent choice for various object detection applications where real-time processing is crucial.
 - Clerk Authentication
     - Description: Clerk authentication is a service that provides authentication and user management solutions for web applications. 
     - Why: By leveraging Clerk authentication, we ensure a secure, efficient, and scalable user management system that enhances the overall functionality and security of our web application while allowing us to maintain a microservice architecture approach to our system design.
 - GitHub Actions (Automated Testing on Pull to Main)
     - Description:  GitHub Actions is a powerful, flexible tool that allows you to automate workflows directly in your GitHub repository. These workflows can perform a wide range of tasks, including building, testing, and deploying code, as well as performing various automated checks and integrations.
     - Why: Its seamless integration with GitHub, combined with its powerful and customizable workflows, makes it an indispensable tool for modern software development. Implementing GitHub Actions can lead to more efficient workflows, quicker releases, and a more robust and reliable codebase.

# 4. Risks
***
### 4.1 Technical Risks:
 - Errors in optical mark recognition
 - Scalability issues
 - Data loss or corruption
 - Integration. Soeciffically, there may be difficulty integrating with the existing university systems.

### 4.2 Security Risks:
 - Data Breaches
 - Weak Authentication
 - Operational Risks
 - User Adoption
 - Social Engineering Attacks
 - Lack of Security Awareness
 - Resistance to Change
 - Misconfiguration
 - Unauthorized Access
 - System Downtime

### 4.3 Regulation Risks:
 - Privacy regulations
 - Licenses
 - University privacy policies


# 5. Milestone Summary
***
We have a balanced team with varied expertise, and each member is capable of contributing to different aspects of the project. By not assigning specific features to individual team members, we maintain flexibility in prioritizing tasks based on time, resources and expertise. This is important for meeting the expectations of the deadline.  This approach allows us to:
##### Leverage Strengths:
Each team member can work on tasks that align with their strengths, ensuring high-quality output.
##### Flexibility:
As priorities shift or as we encounter unforeseen challenges, we can reassign tasks without disrupting the overall workflow.
##### Collaborative Learning:
Team members can assist each other, share knowledge, and learn new skills throughout the project.
##### Efficient Use of Time:
By assessing the current workload and deadlines, we can dynamically allocate resources to ensure timely completion of milestones.

## Milestones
##### Milestone 1: Project Proposal   Submission
Deadline: May 29, 2024
Deliverables:
- Project Proposal Document
- Short video presentation describing user groups and project requirements

Description: Submit a comprehensive project plan outlining the scope, objectives, timelines, and requirements. The video presentation should provide an overview of the project's user groups and requirements, to be reviewed by the client for feedback.

##### Milestone 2: Design Submission
Deadline: June 5, 2024
Deliverables:
- Design Document 
- System Architecture Plan
- User Interface Mock-ups (created using Figma)
- Use Case Scenarios
- Passing Tests for Initial System
- Short video presentation describing the project design

Description: Develop and submit the project design, including the system architecture, user interface mock-ups, and use case scenarios. Ensure the design is consistent with the project's requirements. Provide a video presentation and obtain client feedback.

##### Milestone 3: Mini-Presentations
Deadline: June 14, 2024
Deliverables:
- Short text description of envisioned usage
- Implementation of 3 features 
- User Login
- Creation of Exam Event
- Uploading of Exams
- Tests for the implemented features

Description: Prepare a mini-presentation that includes a brief description of the envisioned usage and demonstrate three working features. Ensure these features are tested and functional.

##### Milestone 4: MVP Mini-Presentations
Deadline: July 5, 2024
Deliverables:
- Short text description of envisioned usage
- Implementation of 50% of project features
- Completion of User Login
- Completion of Exam Event
- Uploading of Exams
- Marking of Exams
- Dashboard of Exam
- Tests for the implemented features

Description: Present the Minimum Viable Product (MVP) by delivering 50% of the project's features. Provide a description of the envisioned usage and ensure all features are tested. Clients will be invited for feedback.

##### Milestone 5: Peer Testing and Feedback
Deadline: July 19, 2024
- Deliverables:
- Implementation and testing of two additional features per team member
- Peer review and integration feedback

Description: Implement and test two additional features per team member. Plan for code reviews, integration, and regression testing to ensure the system's robustness. Collect and incorporate peer feedback.

##### Milestone 6: Test-O-Rama
Deadline: August 2, 2024
Deliverables:
- Full-scale system testing
- User testing feedback

Description: Conduct comprehensive system and user testing. Ensure the entire system is tested for functionality, usability, and performance. Collect and incorporate feedback from users to refine the project.


##### Milestone 7: Final Project Submission and Group Presentations
Deadline: August 9, 2024
Deliverables:
- Final Project Submission
- Group Presentation
- Final Report

Description: Submit the completed project and prepare for the final group presentation. Ensure the final report includes all necessary documentation, testing results, and feedback integration. Present the project to the clients and stakeholders.

# Team Overview
***
### Team Member 1: Nathan Jacinto
##### Skills:
- Web Development: Proficient in front-end and back-end web development, including HTML, CSS, JavaScript, PHP and frameworks like React.js and Node.js.
- Data Management: Experienced in database design, management, and optimization using SQL and NoSQL databases.
- Canva: Skilled in using Canva to create visually appealing graphics, presentations, and marketing materials.
- Video Editing: Proficient in video editing software such as Adobe Premiere Pro, capable of producing high-quality video content.
- Tableau: Advanced skills in Tableau for data visualization and analysis, creating interactive and insightful dashboards.
- Project Management: Strong project management skills, including planning, organizing, and managing resources to achieve project goals.
- Data Analysis: Proficient in data analysis techniques and tools, capable of extracting meaningful insights from complex datasets. Experience with the R programming language.
- Figma: Experienced in using Figma for designing user interfaces and creating interactive prototypes.
- AI and Machine Learning: Knowledgeable in AI and machine learning concepts and techniques, capable of applying machine learning algorithms for predictive analysis.

##### Expect to Learn:
- Advanced web security practices and techniques to ensure the highest level of security for web applications.
- Integration of various data management systems and ensuring seamless data flow between them.
- Enhancing video editing skills with more complex effects and transitions.
- Advanced features and functionalities in Tableau to create more sophisticated visualizations.
- New project management methodologies and tools to improve efficiency and effectiveness.
- Applying data analysis techniques to new and complex datasets, and exploring machine learning algorithms for predictive analysis.
- Mastering advanced features of Figma to create even more interactive and user-friendly prototypes.
- Computer vision libraries, technologies and concepts.

##### Roles and Responsibilities:
- Project Management: Oversee the project using Kanban board maintenance, ensuring the team stays on track with deadlines and deliverables.
- System Architecture Design: Collaborate on designing the system architecture, ensuring it meets the project's requirements and is scalable.
- User Interface Design: Contribute to the design of the user interface, focusing on creating an intuitive and user-friendly experience using Figma.
- Database Setup and Management: Set up and manage the project’s databases, ensuring data integrity and security.
- Video Creation and Editing: Lead the creation and editing of project-related videos, ensuring high-quality output.
- Tableau Dashboards: Develop interactive and insightful dashboards to visualize project data and support decision-making processes.
- Data Analysis: Conduct data analysis to provide actionable insights and support project objectives.

### Team  Member 2: Nicolaas Kouwenhoven
##### Skills:
- Web Development: Experience with HTML, CSS, JSX, PHP, React.js, Node.js
- Data Management: Experienced in database design, management, and optimization with MySQL. Solid understanding of relational databases
- Data Analysis: Experience with the R programming language and a small amount of MATLAB from Calculus
- Project Management: Strong project management skills, including planning, organizing, and managing resources to achieve project goals.
- Figma: Experienced in using Figma for designing user interfaces and creating interactive prototypes.

##### Expect to Learn:
- Computer vision libraries, technologies and concepts.
- Advanced web security practices and techniques
- Integration of various data management systems, ensuring seamless data flow between them.
- Advanced features and functionalities in Tableau to create more sophisticated visualizations.
- New project management methodologies and tools to improve efficiency and effectiveness.
- Applying data analysis techniques to new and complex datasets, and exploring machine learning algorithms for predictive analysis.
- Mastering advanced features of Figma to create even more interactive and user-friendly prototypes.

##### Roles and Responsibilities:
- System Architecture Design: Collaborate on designing the system architecture, ensuring it meets the project's requirements and is scalable.
- User Interface Design: Contribute to the design of the user interface, focusing on creating an intuitive and user-friendly experience using Figma.
- Database Setup and Management: Set up and manage the project’s databases, ensuring data integrity and security.
- Tableau Dashboards: Develop interactive and insightful dashboards to visualize project data and support decision-making processes.
- Data Analysis: Conduct data analysis to provide actionable insights and support project objectives.


### Team Member 3: Jay Bhullar
##### Skills:
- Web Development: Front-end experience with HTML, CSS, JavaScript and React. Back-end web development experience PHP , Spring and Node.js.
- Data Management: Experience in database SQL and  MongoDB. Can work with Relational Data 
- Diagrams/Charts: Adept at creating engaging visuals and marketing materials using tools like Canva and LucidChart.
- Multimedia Production: Experienced in producing high-quality video and audio content, with proficiency in software like Final Cut Pro and Audacity.
- Statistical Analysis: Proficient in statistical analysis and modeling techniques, with hands-on experience using Python for data science projects.
- Cloud Computing: Knowledgeable in deploying and managing applications on cloud platforms such as AWS.

##### Expecting To Learn:
- Utilizing Bootstrap to develop responsive, mobile-first web applications efficiently.
- Enhancing skills in Figma for collaborative UI/UX design, prototyping, and user feedback integration.
- Deepening knowledge of PostgreSQL for robust database management and handling complex queries.
- Leveraging Node.js and Express.js to create efficient and scalable backend systems.
- Exploring advanced features of Tableau to develop more sophisticated data visualizations and analytics.
- Improving project management efficiency by learning new methodologies and tools.
- Applying advanced data analysis techniques to new datasets and exploring machine learning algorithms for predictive analysis.
- Mastering Docker to ensure consistent development, testing, and production environments.
- Implementing YOLOv3 for real-time object detection in various applications.
- Integrating Clerk Authentication for secure and seamless user authentication in applications.


##### Roles and Responsibilities:
- Node.js and Express.js Integration: Create efficient and scalable backend systems using Node.js and Express.js, enabling smooth data flow and API management.
- PostgreSQL Database Management: Set up, manage, and optimize PostgreSQL databases, ensuring data integrity and robust performance for complex queries.
- React.js Development: Build and maintain high-performance, reusable user interfaces using React.js, ensuring a seamless user experience.
- Machine Learning Application: Explore and apply machine learning algorithms for predictive analysis, leveraging complex datasets to derive actionable insights.
- System Architecture Design: Collaborate on designing a scalable system architecture that meets the project's requirements and supports future growth.
- Web Security Practices: Implement advanced web security practices and techniques to protect the application from vulnerabilities and ensure data protection.

### Team Member 4: Jack Mathisen

##### Skills:
- Web Development: Front End experience with HTML, CSS, Javascript. Backend experience with PHP, and Node.js
- Data Management: Experience with database SQL
- Diagrams/Charts: Competent at designing engaging visual resources using Canva, as well as Piktochart
- Statistical Analysis: Experience using R in multivariate settings, with an emphasis on empirical analysis.  
- Project Management: Experience with group organization, handling disputes within teams, and ensuring milestone completion. 

##### Expecting To Learn:
- Further growing experiences with Bootstrap, and improving implementation.
- Learning skills in Figma and gaining exposure to collaborative User interface and User Experience design.
- Increasing competency with SQL and interconnectedness to project stability.
- Developing further understanding of Node.js, as well as Express.js.
- Increasing skills with regards to application of User Interface design principles thus improving marketability of said project 
- Gaining further experience with Node.js and its API reusability. 
- Increasing React.js skills so as to ensure realization of important design principles.
- Improving project management styles when engaging with multivariate scenarios.
- Improved velocity when developing projects with Docker and interrelation between data management and application.
- Developing further resources for data analysis, as well as implementation of machine learning protocols for projects

##### Roles and Responsibilities:
- System Architecture: Developing system architecture so as to maximize data flow and API reusability 
- User Interface Design: Ensuring design protocols are met, and accomplishing feasibility and simplicity with regards to user experience. 
- Database setup and management: Implementation of 
- React.js Development: Improve site features and visual symmetry so as to maximize user experience
- Node.js Development: Implement organized structures for data workflow so as to optimize API employment.
- Machine Learning Application: Further grasp and execute algorithms that ensure vapidness of processing requirements. 
- Web Security Practices: provide secure ease of use for users and veritable transfer of data between different users. Ensure anonymity of user data. 

### Team Member 5: Oakley Pankratz

##### Skills:
- Web Development: Experience with front-end development including Javascript, HTML, and react.js.
- Databases: Strong understanding of relational databases, and experience with MySQL. 
- Statistics: Experience in statistical analysis using R and MATLAB.
- Computer Vision: Practical experience with Computer Vision using MATLAB.
- Networks: A strong understanding of the layered architecture of the internet. Knowledge of the application and transport layers may be especially useful for this project.
- Cyber Security: I have a solid understanding of cryptography and public key infrastructure.

##### Expecting To Learn:
- More proficiency with front-end development including HTML and react.js. I’m also prepared to learn CSS if necessary. 
- Acquire Back-end Development skills. It would be nice to learn some Node.js
- User Authentication. I would like to gain some hands-on experience with cybersecurity, rather than just a theoretical understanding of it.
- Testing libraries. While I have some experience with the testing library Mocha, I would like a more complete understanding of how such libraries work.
- I’ve never used Figma before, and I would like to gain some experience with it.

##### Roles and Responsibilities:
- Contribute to the planning and design of our system.
- Familiarize myself with Computer Vision libraries.
- Work with Figma to help create a prototype for a rich user-interface.
- Use React.js to create a front-end interface that matches the interface created in Figma.
- Work with the team in a timely fashion, regularly contributing to issues on the KanBan board.
- Contribute to the Development of the back-end.

***
|  Category of Work/Features  | Nathan Jacinto | Nicolaas Kouwenhoven | Jay Bhullar | Jack Mathisen | Oakley Pankratz |
| ------------- | :-------------: | :-------------: | :-------------: | :-------------: | :-------------: |
|  **Project Management: Kanban Board Maintenance**  | :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark: |
|  **Weekly Team Logging**  | :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
|  **System Architecture Design**  | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark:  | :heavy_check_mark:  | :heavy_check_mark: |
|  **User Interface Design**  | :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
|  **CSS Development**  | :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
|  **User Creation and Authentication**  | :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
|  **Course Management Features**  |  | :heavy_check_mark: |  |  | :heavy_check_mark: |
|  **Tableau Dashboards**  | :heavy_check_mark: |  | :heavy_check_mark: |  |  |
|  **Data Analysis**  |  |  | :heavy_check_mark: | :heavy_check_mark: |  |
|  **Code Review**  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
|  **Security**  |  |  | :heavy_check_mark: |  | :heavy_check_mark: |
|  **Computer Vision & AI**  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
|  **Database setup**  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark:  | :heavy_check_mark: |
|  **Presentation Preparation**  | :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: |
|  **Video Creation**  |  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
|  **Video Editing**  | :heavy_check_mark:  |  |  | :heavy_check_mark: |  |
|  **Report**  | :heavy_check_mark:  |  |  |  |  |
