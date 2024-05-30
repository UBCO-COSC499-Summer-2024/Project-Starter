# Project Proposal For Project #4

**Team Number:** 11

**Team Members:** Jayden Jayawardhena, Joshua Ndala, Abhishek Dash, Muhammad Danial Asif, Cormac Walsh

## Overview

### Project purpose or justification (UVP)

Our software is  a platform for teachers to provide courses to students. Students can receive rapid grading and personalized feedback using an advanced Large-Language-Model. This makes it easier for a teacher to manage a large class, focusing on the big picture,  as the AI is responsible for overseeing the day-to-day progress of a student. Teachers can expect a more intuitive and simplified workflow compared to traditional course management softwares. Students can expect immediate feedback, which further empowers them to move ahead in lessons knowing where to improve.

**High-level project description and boundaries**

Our capstone project involves developing a web application with AI capabilities to help educational institutions manage and evaluate assignments. The main features of the application include:


* **Assignment Creation and Submission:** Instructors will be able to set deadlines and specific requirements for their assignments. Through the web-based system, students can turn in their assignments.
* **Automated Grading:** Using previously established rubrics that the professors supply, the AI component will assess completed assignments. Students will receive grades and thorough feedback from the system. 
* **User Management:** With various access levels and permissions, the platform will support multiple user roles, such as teachers, students, and administrators. 

**Minimum Viable Product (MVP)**

The basic functions required for establishing the sustainability and value of the application will be included in the MVP. This will consist of an easy-to-use interface for creating and turning in assignments, an AI model that grades work according to pre-established rubrics, and basic user management to set up different roles and permissions for students and teachers. The main goal is to deliver a working prototype that highlights the system’s primary functions.

**System Boundaries**

The system will focus on fundamental assignment management capabilities like creation, submission, and AI-based grading. User authentication and role-based access control will be used to guarantee proper access. However, this project does not include advanced AI features like adaptive learning, integration with third-party educational programs, significant security measures, or multilingual assistance. This helps make sure that the MVP development process remains focused and controlled. 

**Measurable project objectives and related success criteria (scope of project)**

**Make sure to use a simple but precise statement of goals for the project that will be included when the project is completed. Remember that goals must be clear and measurable and SMART. It should be clearly understood what success means to the project and how the success will be measured (as a high level, what is success?).**



* Assignment Creation and submission: Enable Instructors to create and manage assignments with deadlines. **Success Criteria: **100 percent of instructors can create assignments on the platform. 
* AI Driven Feedback and Grading: Provide Grades and comments to students who submit assignments on the platform. **Success Criteria: **at least 90 percent of assignments are unofficially graded by the AI within the first 1 minute of uploading pending review by teacher/TA. 
* User Management: Implement a robust user management system with role based access and different permissions for different user groups(Administrator, Teacher, Student, Teaching Assistant). **Success Criteria:** A hundred percent of users have the desired access levels and zero incidents of unauthorized access within the first six months. 
* Platform Reliability and performance: Maintain Uptime of at least 99.9 percent and average load time of &lt;4 seconds. **Success Criteria**: uptime> 99.9 % and the average load time &lt;4 seconds. 
* User Base: Achieve a user base of at least 1000 active users within the first 6 months of launch. **Success Criteria: **Number of users > 1000 after 6 months
* Teacher/TA Review: At all times, let teachers and TA’s override grading and comments by the AI. **Success Criteria: **TAs and Teachers should be able to override the AI’s comments and grading a 100 percent of the time. 

## Users, Usage Scenarios and High Level Requirements

### Users Groups

Provide a description of the primary users in the system and when their high-level goals are with the system (Hint: there is more than one group for most projects). Proto-personas will help to identify user groups and their wants/needs.



1. Teachers: They can use the system our project is based on in order to design their course better by designing better marking schemes for their exams that will lead to more fair grading for students.
2. Students: Using the grading system our team will be making, students can plan their exam preparation strategy based on the grading criteria of each section of the exams in order to achieve better marks.
3. Teaching Assistants: Teaching Assistants may be biased during grading exams. However, with the help of our system, they can get a better understanding of distributing marks for each section of the exam which includes multiple choice, short answer, and long answer questions. With AI suggested grading Teaching Assistants should be able to grade much more quickly.
4. Administrators, ability to grant and deny permissions. General maintenance of software, user support for technical difficulties.

### Envisioned Usage

What can the user do with your software? If there are multiple user groups, explain it from each of their perspectives. These are what we called user scenarios back in COSC 341. Use subsections if needed to make things more clear. Make sure you tell a full story about how the user will use your software. An MVP is minimal and viable, so don’t go overboard with making things fancy (to claim you’ll put in a ton of extra features and not deliver in the end), and don’t focus solely on one part of your software so that the main purpose isn’t achievable. Scope wisely. Don't forget about journey lines to describe the user scenarios.



* Four groups of users, Teachers, Teaching Assistants, Students and administrators.
    * Teachers, The Professor, Dr. Lionel is a professor of web development specifically in the programming language of React and Javascript where he teaches to a class of over 100 students. In this class he requires the students to learn via short answers, multiple choice and programming questions. He finds that when marking these he finds the work very tedious. Thus, Lionel wants the software to be able to quickly provide student feedback and to grade within his own rubric. So Lionel provides the AI grader with a rubric as well as an example to represent each subsection of the rubric. And the professor provides a perfect example. The AI interfaces a suggested score and a confidence of that score, based on the rubric with specific examples within the student response as to where the student lost or gained points. Primarily the professor focuses on only the assignments marked for supplementary viewing by the TA.
    * Teaching Assistants, Mark Antony he is one of two TAs in Professor Lionel web development course. As the TA, Dr. Lionel has told him that he is responsible for making sure the AI is providing reasonable grading practices. Mark tests this by using the specific interface designed for TAs, where he writes various answers to the questions and helps modify AI by providing feedback. Once he is satisfied by the accuracy of the AI he allows the AI to start marking student assignments. The TA has the ability to also review the grading of the AI system similar to the process available to the professor. The TA reviews the assignments by using the interface in which the AI shows the areas of where the student lost points, this is shown to the TA and can quickly be approved or denied (which is where the student receives back the point). The TA can then submit official comments with the approved graded assignment. The TA also has the option to flag an assignment for professor review.
    * Students, a student in web development named Tony writes his first assignment in html. The goal of the assignment is to create a textbox within another textbox. He is provided with the rubric and the example, that indicates what is necessary for the assignment. The Student can upload files in a specific format that is specified. After the assignment is graded and reviewed by the TA the student can view where he lost and gained points. He also has the ability to dispute a specific mark.
    * Administrators, they have the ability to grant permissions for various user groups, additionally have the ability to delete data. Can modify existing software.


### Requirements

**In the requirements section, make sure to clearly define/describe the functional requirements (what the system will do), non-functional requirements (performance/development), **user requirements (what the users will be able to do with the system and technical requirements. These requirements will be used to develop the detailed uses in the design and form your feature list.**

### Functional Requirements



* The system will support logins for student, and teacher user types
* A User will be directed to their corresponding dashboard upon succesful login
* A Student will join a course via a course code
* A student can remove themselves from a course
* A Student will be able to view courses, grades, and account info from their dashboard
* A Teacher will see their courses with corresponding grade statistics, assignments, and account info from their dashboard
* A teacher will be able to assign TAs for a course
* A teacher will be able to remove students from a course
* A Student will receive feedback and unofficial grades on an assignment, after uploading the corresponding files, by the AI
* A student will be notified if any uploaded files are missing or invalid, and be asked to resubmit the assignment
* A Teacher will be able to create an assignment for a course, with a corresponding rubric, for students to complete
* A Teacher will be able to submit a rubric which aligns the AI grading process for the corresponding assignment
* A Teacher or TA will be able to review and officialise grades from the AI.
* The AI will be able to flag where a mistake was made for Teacher or TA review
* The AI will flag any uncertainty in grading for Teacher or TA review
* A course that is no longer actively being managed will be archived, then deleted after an expiration date
* Any of the Teacher's assignments and rubrics can be resued across courses

### Non-functional Requirements

* Only Teachers have the right to change the rubric
* A student will receive unofficial AI feedback in under 1 minute
* A course can handle at least 300 students without performance deterioration
* The system will run on any browser
* Webpages will load in under 5 seconds
* The system will be accessible to those with any kind of visual impairments
* The system should be operational 24/7
* Teachers and TAs will approve AI markings in 1 click

### User Requirements

**Describes what the user needs to do with the system (links to FR)**

1. A teacher would need to submit their rubric created by the AI for each assignment created accordingly. 
2. Based on the rubric of the assignment, a student should know the requirements of the assignment and work on it accordingly.
3. A Teaching Assistant must know when and where to give marks on the student’s assignment based on the rubric submitted to the system. 

**Focus is on the user experience with the system under all scenarios**

1. The teacher should be able to continue submitting rubrics to the AI with the assurance that the AI follows the rubric rather than making changes to it.
2. The student must be able to learn the most from the course based on what the rubric grades the student’s assignment on.
3. The teaching assistant must be able to trust the rubric in order to continue using it for grading and feel like they are doing an honest and valuable job for the students and teachers.

### Technical Requirements



1. **Implement a secure login method with database tracking.**
    1. To guarantee safe login processes, we will be using use of industry-standard authentication methods
    2. We will use encryption to store and manage user credentials in our database safely.
    3. We will use multi-factor authentication (MFA) to strengthen security further.
2. **Support the rubric submission and feedback processes.**
    4. A user-friendly interface will allow teachers to upload and manage rubrics.
    5. The AI grading system will be able to effectively access and use the rubrics because they will be stored in a structured form within the database.
    6. Based on these rubrics, the system will produce feedback, guaranteeing consistency in grading
    7. Teachers and students will have access to stored feedback for future reviews.
3. **Maintain consistent grading workflows for TAs and teachers.**
    8. Teachers and teaching assistants will be able to monitor the grading process through a dashboard.
    9. TAs and professors will be able to make the necessary changes to the AI-generated grades using a review interface.
    10. When assignments are ready for evaluation or have been recognized by the AI as potentially problematic, TAs and teachers will receive an alert through a notification system.
    11. The system will monitor and record all modifications made by TAs and teachers to guarantee accountability.
4. **Be accessible on any web browser with quick load times.**
    12. For complete compatibility with all major web browsers, the application will be created according to responsive design principles
    13. For better user experience and engagement, the main pages should load in less than 4 seconds.
5. **Use Docker for consistent and dependable deployment across several environments.**
    14. The program will be containerized using Docker, ensuring consistent operation across different development, testing, and production environments.
    15. The deployment process will be streamlined, allowing fast and dependable application upgrades
6. On top of that, Docker will help in application scaling by making container replication simple enough to manage growing loads. 

### Tech Stack

**User Interaction:**



* **Web browser**: Through a web browser, users (teachers and students) will interact with the software. This ensures accessibility and cross-platform compatibility because the majority of users will already have a browser installed.
    * Justification: Given their ease of use and lack of installation requirements, web browsers are the recommended option for educational platforms

### Interface Development



* **React.js**: A user interface library written in JavaScript. React is known for its architecture based on components, which allows better maintenance and reusability
    * Justification: React is a popular option for web applications because of its effectiveness, active community support, and compatibility with many other tools and frameworks
* **Material UI**: A popular React UI framework offering a collection of components that carry out Google Material Design. It improves the UI with a modern, organized design framework. 
    * Justification: With pre-built components, Material UI accelerates development while maintaining design consistency and providing a visually appealing interface

### Logic and Backend Development



* **Node.js**: A server-side development JavaScript runtime based on the V8 JavaScript engine in Chrome. Because Node.js is scalable and efficient, it can handle several requests at once
    * Justification: Node.js provides great backend logic performance and allows for seamless interaction with React.js

**Data Storage:**



* SQL (PostgreSQL)

**Programming Languages:**



* JavaScript
* HTML
* CSS

**Containerization:**



* Docker: A platform for creating, transporting, and using apps inside of containers. Docker packages the application along with its dependencies, ensuring consistency across different environments. 
    * Justification: Docker speeds up the deployment process and improves development and operational efficiency by enabling dependable application functioning in any environment

### High-level Risks


<table>
  <tr>
   <td colspan="6" ><strong>Risk Assessment Grid</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Risk</strong>
   </td>
   <td><strong>Potential Impact</strong>
   </td>
   <td>
   </td>
   <td><strong>Chances of Occuring</strong>
   </td>
   <td><strong>Can It Be Controlled?</strong>
   </td>
   <td><strong>Action Required In Case of Occurence</strong>
   </td>
  </tr>
  <tr>
   <td>Timeline Delays
   </td>
   <td>Project delays could have an impact on the delivery and stakeholder trust
   </td>
   <td>
   </td>
   <td>Medium
   </td>
   <td>Yes
   </td>
   <td>Make a thorough project schedule that includes a break period and manage tasks in advance
   </td>
  </tr>
  <tr>
   <td>Insufficient Technical Skills
   </td>
   <td>Limited experience among developers could result in slower development or mistakes
   </td>
   <td>
   </td>
   <td>Low
   </td>
   <td>Partially
   </td>
   <td>Provide training, assign work according to skill sets
   </td>
  </tr>
  <tr>
   <td>Integration Issues
   </td>
   <td>The web application and AI grading system might not work well together
   </td>
   <td>
   </td>
   <td>Medium 
   </td>
   <td>Yes
   </td>
   <td>Conduct extensive testing, and leave room for modifications
   </td>
  </tr>
  <tr>
   <td>Data Security Risks
   </td>
   <td>The integrity of grades and student data can be jeopardized by potential breaches. 
   </td>
   <td>
   </td>
   <td>High
   </td>
   <td>Yes
   </td>
   <td>Implement strong security measures, do regular checks, and follow data protection regulations
   </td>
  </tr>
  <tr>
   <td>AI Version Becoming Outdated
   </td>
   <td>AI models can quickly become outdated, which would decrease grading effectiveness. 
   </td>
   <td>
   </td>
   <td>High
   </td>
   <td>Yes
   </td>
   <td>Plan for regular upgrades, stay current on AI developments, and design the system to allow for easy model updates
   </td>
  </tr>
</table>


## Assumptions and constraints

### Assumptions

* Availability of AI Models capable of grading student work: This project assumes that LLM’s such as Open AI’s are reliable and can be integrated into the platform to provide feedback and grading. 
* User Proficiency: We assume that users have basic proficiency with web applications and can navigate the platform’s dashboard, courses, etc. 
* Internet Availability: It is assumed that all users (students, teachers, administrators and TA’s) have access to reliable internet and can use the web platform effectively. 
* Adequate Resources: It is assumed that the project team will have all the needed resources(personnel, time, budget) to ensure that the schedule is completed on time. 

### Constraints

* Time constraints: The project must be completed within 13 weeks of the summer term. 
* Dependency on third party services: The project may rely on third party services (such as the OpenAI’s API) that could affect project timelines and functionality.
* User Adoption: The success of the platform depends on the users and how easily they will adapt to the new system and consistently use it. 
* Encryption quality for passwords

## Summary milestone schedule


<table>
  <tr>
   <td><strong>Milestone</strong>
   </td>
   <td><strong>Deliverable</strong>
   </td>
  </tr>
  <tr>
   <td>May 29th 
   </td>
   <td>Project Plan Submission
   </td>
  </tr>
  <tr>
   <td>May 29th
   </td>
   <td>A short video presentation describing the user groups and requirements for the project. This will be reviewed by your client and the team will receive feedback.
   </td>
  </tr>
  <tr>
   <td>June 5th
   </td>
   <td>Design Submission: Same type of description here. Aim to have a design of the project and the system architecture planned out. Use cases need to be fully developed. The general user interface design needs to be implemented by this point (mock-ups). This includes having a consistent layout, color scheme, text fonts, etc., and showing how the user will interact with the system should be demonstrated. It is crucial to show the tests passed for your system here.
   </td>
  </tr>
  <tr>
   <td>June 5th
   </td>
   <td>A short video presentation describing the design for the project. This will be reviewed by your client and the team will receive feedback
   </td>
  </tr>
  <tr>
   <td>June 14th
   </td>
   <td>Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have 3 features working for this milestone (e.g., user log-in with credentials and permissions counts as 1 feature). Remember that features also need to be tested.
   </td>
  </tr>
  <tr>
   <td>July 5th
   </td>
   <td>MVP Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have close to 50% of the features working for this milestone. Remember that features also need to be tested. Clients will be invited to presentations.
   </td>
  </tr>
  <tr>
   <td>July 19th
   </td>
   <td>Peer testing and feedback: Aim to have an additional two features implemented and tested per team member. As the software gets bigger, you will need to be more careful about planning your time for code reviews, integration, and regression testing.
   </td>
  </tr>
  <tr>
   <td>August 2nd
   </td>
   <td>Test-O-Rama: Full scale system and user testing with everyone
   </td>
  </tr>
  <tr>
   <td>August 9th
   </td>
   <td>Final project submission and group presentations: Details to follow
   </td>
  </tr>
</table>



## 


## **Teamwork Planning and Anticipated Hurdles**

Based on the teamwork icebreaker survey, talk about the different types of work involved in a software development project. Start thinking about what you are good at as a way to get to know your teammates better. At the same time, know your limits so you can identify which areas you need to learn more about. These will be different for everyone. But in the end, you all have strengths and you all have areas where you can improve. Think about what those are, and think about how you can contribute to the team project. Nobody is expected to know everything, and you will be expected to learn (just some things, not everything). Use the table below to help line up everyone’s strengths and areas of improvement together. The table should give the reader some context and explanation about the values in your table.

For experience provide a description of a previous project that would be similar to the technical difficulty of this project’s proposal. None, if nothing For good At, list of skills relevant to the project that you think you are good at and can contribute to the project. These could be soft skills, such as communication, planning, project management, and presentation. Consider different aspects: design, coding, testing, and documentation. It is not just about the code. You can be good at multiple things. List them all! It doesn’t mean you have to do it all. Don’t ever leave this blank! Everyone is good at something!


<table>
  <tr>
   <td>Category
   </td>
   <td>Abhishek Dash
   </td>
   <td>Joshua Ndala
   </td>
   <td>Muhammad Danial Asif
   </td>
   <td>Jayden Jayawardhena
   </td>
   <td>Team Member 5
   </td>
  </tr>
  <tr>
   <td>Experience
   </td>
   <td>I have used
<p>
Java and Python to write code for previous projects and coding assignments. Later on, i also got the opportunity to use JavaScript, HTML, and CSS to design the front-end of webpages.
   </td>
   <td>In my previous project, I created and tested deep learning models to detect fake news, using machine learning and natural language processing techniques. Although we won’t train models, the knowledge and skills that I learned are still relevant. Both projects involve implementing AI solutions, data processing and analysis, and application integration. I have the skills to integrate and use the API for automatic grading
   </td>
   <td>I have worked on previous projects and have worked with Java, Javascript, HTML and CSS. Also have prior experience with using MySql for databases. 
   </td>
   <td>I have built web apps before using JS and the  React framework. I am familiar with using AI apis, such as DALL-E. I have also used Docker and MySQL.
   </td>
   <td>I have built web applications before in class for projects. The web app was built with JavaScript, PHP, CSS, HTML and MySQL for the database. I have used various large language models for personal use. Have experience for professional documentation.
   </td>
  </tr>
  <tr>
   <td>Good At
   </td>
   <td>Java, HTML, CSS
   </td>
   <td>Programming (JavaScript, HTML, CSS, SQL, Java, Python), backend development, machine learning, project management, documentation
   </td>
   <td>Communication skills, Presentation, HTML, CSS and software testing
   </td>
   <td>Backend, Server architecture, Diagrams and planning.
   </td>
   <td>Python, documentation, Relational Databases (SQL)
   </td>
  </tr>
  <tr>
   <td>Expect to Learn
   </td>
   <td>I expect to be able to learn React in order to build the grading AI.				
   </td>
   <td>React development, AI integration, data privacy and security, build on previous Docker knowledge, improve front-end development skills, testing
   </td>
   <td>React development, Docker and implementation of AI
   </td>
   <td>React development, PostgeSQL, Docker.
   </td>
   <td>Prompt Engineering for the AI, communication with a client
   </td>
  </tr>
</table>


Use this opportunity to discuss with your team who may do what in the project. Make use of everyone’s skill set and discuss each person’s role and responsibilities by considering how everyone will contribute. Remember to identify project work (some examples are listed below at the top of the table) and course deliverables (the bottom half of the table). You might want to change the rows depending on what suits your project and team. Understand that no one person will own a single task. Recall that this is just an incomplete example. Please explain how things are assigned in the caption below the table, or put the explanation into a separate paragraph so the reader understands why things are done this way and how to interpret your table.


<table>
  <tr>
   <td>Category of Work/Features
   </td>
   <td>Abhishek Dash
   </td>
   <td>Joshua Ndala
   </td>
   <td>Muhammad Danial Asif
   </td>
   <td>Jayden Jayawardhena
   </td>
   <td>Cormac Walsh
   </td>
  </tr>
  <tr>
   <td>Project Management: Kanban Board Management
   </td>
   <td>
   </td>
   <td> ✔️
   </td>
   <td>
   </td>
   <td>
   </td>
   <td> ✔️
   </td>
  </tr>
  <tr>
   <td>System Architect Design
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>User Interface Design
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>CSS Development
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>Feature #1
<p>
User Registration
   </td>
   <td>
   </td>
   <td>✔️
   </td>
   <td>
   </td>
   <td>✔️
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Feature #2
<p>
Course Registration and Creation
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>Feature #3
<p>
Student Dashboard
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>✔️
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Feature #4
<p>
Professor Dashboard
   </td>
   <td>✔️
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>Feature #5
<p>
TA Dashboard
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>✔️
   </td>
   <td>
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>Feature #6
<p>
Teacher Training AI
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Feature #7
<p>
TA Review Assignment
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>✔️
   </td>
   <td>
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>Feature #8
<p>
Course Deletion
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>DataBase Setup
   </td>
   <td>✔️
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>✔️
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Presentation Preparation
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>Design Video Creation
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>Design Video Editing
   </td>
   <td>
   </td>
   <td>✔️
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Design Report
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>Final Video Creation
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>Final Video Editing
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>Final Team Report
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
  <tr>
   <td>Final Individual Report
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>✔️
   </td>
  </tr>
</table>
