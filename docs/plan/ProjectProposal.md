# Project Proposal for Project 1 (CMPS Department Management Program)

**Team Number:** 12

**Team Members:** Yiyang Du, Dichen Feng, Marshall Kwok Guo, Vaughn Janes, Jiayao Ni

## Overview:

### Project purpose or justification (UVP)

> What is the purpose of this software? What problem does it solve? What is the unique value proposition? Why is your solution better than others?

The purpose of our project, the Department Management System, is to create a responsive web application that supports managing the CMPS department. This will enhance the visibility and efficiency of instructor activities. We believe this is really important because having a clear and efficient system will save time for department heads and instructors, allowing them to focus more on teaching and less on administrative tasks. Plus, with better visibility, everyone can stay more organized and informed about their roles and responsibilities.

#### UVP:

There is no such system now for the instructors and the department to conveniently visualize the assignments of staff members and their working hours. Our program will make it easier for the instructors to have an idea of how much time they will work. This will make it easier for the department to know the working hours of every instructors. Also, we will add some encouraging words to encourage the instructors who work less hours than the others to work more and having better students satisfaction.

### High-level project description and boundaries

> Describe your MVP in a few statements and identify the boundaries of the system. 

#### MVP 
We will develop a system for department heads to easilly log and track service roles for instructors, including Undergraduate Advisor, Graduate Advisor, and committee member roles. The system will store descriptions and expected hours per month for each service role without requiring instructors to log their time actively.

We will also implement a feature to track course assignments, including student numbers, survey data, and other relevant metrics. This will allow department heads to see individual instructor data and overall department performance through charts and visualizations.

Next, we will develop a dashboard for instructors to view their current service hours, course assigments, and see their contribution to the department. Instructors will not have editing capabilities but can see their data and comparisons with departmental averages.

To encourage instructors for a better distribution, we will also include features that provide encouraging messages such as showing the average service hour of the faculty.

#### Boundaries


### Measurable project objectives and related success criteria (scope of project)

> Make sure to use simple but precise statement of goals for the project that will be included when it the project is completed.  Rememeber that goals must be clear and measurable and **SMART**.  It should be clearly understood what success means to the project and how the success will be measured (as a high level, what is success?).

First, we want to make it super easy and quick to record and manage instructor service roles and teaching assignments, cutting down the time needed from hours to just minutes. Second, we’ll provide real-time visualizations and benchmarks so instructors can see how they’re doing and figure out where they can improve. Third, we’ll help make sure instructors are assigned to the right teaching and service roles based on their past performance. The scope of this project includes developing features for efficient data entry, creating visual performance dashboards, and integrating historical performance data for better role allocation. Success for us means having lots of users who are happy with the system, making life easier for instructors by cutting down their admin work, and improving how teaching and service roles are managed.

We’ll measure:

Gathering user **feedback** surveys to gauge satisfaction (Specific, Measurable, Relevant).

Tracking the **reduction** in admin time through time logs, aiming to reduce it from hours to minutes (Specific, Measurable, Achievable, Relevant, Time-bound).



## Users, Usage Scenarios and High Level Requirements 

### Users Groups (Vaughn will do this part):

> Provide a description of the primary users in the system and what their high-level goals are with the system (Hint: there is more than one group for most projects). Proto-personas will help to identify user groups and their wants/needs.

The two types of users of the CMPS Department Management Program will be:

#### 1. Department Head:
The department head serves as the program administrator. The department head will be able to log into the web program and create staff profiles, create service roles/teaching assignments, and assign these roles/teaching assignments to the staff profiles. Metadata will be enterable by the department head for service roles/teaching assignments, such as the number of students in a class, the number of TAs, room number, etc.
The department head will also be able to enter the number of hours worked per month for each staff profile (with the ability to edit hours for many staff profiles at once), and enter/update performance metrics for staff profiles. Once set up, the department head will be able to visualize working hours and performance metrics for entire selections of staff profiles (for all Statistics professors, for example), as well as individual staff profiles. Of course, the department head will also be able to delete staff profiles, service roles, assignments, etc.
The management system will be accessed by staff members (and the department head) via user accounts, for which the Department Head will serve as the administrator, having the ability to create/delete accounts, reset passwords, and importantly, grant full visibility of certain staff profiles to certain user accounts (so that once a staff member creates an account, they'll be granted permission to see their own performance metrics).

#### 2. Department Staff:
Department staff will be able to create an account at the login/sign up page of the web application. After creating an account, department staff can log into the system and view all staff assignments, courses and course metadata, but will only be able to view their own performance metrics (because this information is confidential). The department staff's own performance metrics will be displayed alongside anonymous metrics such as the average hours worked for their department, as a performance incentive. The department staff generally just have viewing capabilities.

### Envisioned Usage (Vaughn will do this part)

> What can the user do with your software? If there are multiple user groups, explain it from each of their perspectives. These are what we called *user scenarios* back in COSC 341. Use subsections if needed to make things more clear. Make sure you tell a full story about how the user will use your software. An MVP is a minimal and viable, so don’t go overboard with making things fancy (to claim you’ll put in a ton of extra features and not deliver in the end), and don’t focus solely on one part of your software so that the main purpose isn’t achievable. Scope wisely.  Don't forget about journey lines to describe the user scenarios.

#### Department head usage example

1. Prof. Lawrence, the department head, visits the Management Program's web application by clicking the bookmarked URL in his browser
 2. Prof. Lawrence sees the login page, and enters his username and password, and logs in
 3. He sees the Management Program's dashboard, where there are charts and other visualizations of the CMPS department's working hours, assignments/roles, and performance metrics.
 4. A new employee, Mr. Magoo, was hired and needs to be added to the system as part of an onboarding process. Prof. Lawrence navigates to the web app's administration page, and fills out a form to create a new staff profile, which includes a name, and optionally metadata such as an employee number. He then presses the confirm button and a new staff profile is added to the database.
 5. Prof. Lawrence scrolls down to the "Create/modify Job" subsection, located on the same webpage for convenience, to create the course to which Mr. Magoo is assigned to teach (COSC 360). He enters the name "COSC 360 001" and hits the confirm button, and the course is added to the database. If COSC 360 001 already exists, then he doesn't need to do this (and if he does it anyway, then the database will be unchanged)
 6. Prof. Lawrence then scrolls down to the "Create/modify assignment" subsection, searches for Mr. Magoo in the first drop-down text box and selects him, searches for "COSC 360 001" in the second drop-down text box, and then presses the confirm button. In the database, COSC 360 001 is now added to Mr. Magoo's assignments.
 7. Prof. Lawrence either creates a new account for the employee, or the employee has created their own account. Prof. Lawrence navigates to the "Accounts management" subpage of the administration page, and fills out a form to bind Mr. Magoo's new account to his staff profile, and confirms it. Mr. Magoo will now be able to see his own confidential performance metrics when he logs in, once they are submitted.
 8. Prof. Lawrence logs out and goes to lunch

#### Staff member usage example
1. A staff member, Mr. Magoo, visits the CMPS Management Program's webpage and sees the login/sign up page. He presses the "sign up" button, and enters a username and password (twice, to confirm), as well as a UBC email.
2. He receives an email which has a confirmation link, which he visits, and his sign-ups process is complete.
3. In the future, after Prof. Lawrence has set up a staff profile for Mr. Magoo and binded it to his account, and entered his hours and performance metrics, Mr. Magoo logs in again. He clicks his username in the top-right corner of the page and is brought to his own account page, where he can see links to the staff profiles which he has permission to view. He clicks the link to his own profile.
4. He sees his staff profile, just as anyone else would be able to if they had found it via searching the webpage, but since he is logged into an account that has permissions to view confidential data for this staff profile, he also sees his performance metrics displayed.
5. He sees that he has worked 145 hours this week, and that he has some score X relating to his SEI surveys last semester. He has done what he came here to do, so he presses the log out button and leaves.

### Requirements:
The department head will be able to log in to the web application, create/delete staff, create/delete roles, assign/unassign staff to roles, view staff performance metrics (such as SEI statistics) and hours worked 

> In the requirements section, make sure to clearly define/describe the **functional** requirements (what the system will do), **non-functional** requirements (performane/development), **user requirements (what the users will be able to do with the system and **technical** requirements.  These requirements will be used to develop the detailed uses in the design and form your feature list.
#### Functional Requirements:
- Describe the characteristics of the final deliverable in ordinary non-technical language
- Should be understandable to the customers
- Functional requirements are what you want the deliverable to do

#### Non-functional Requirements:
- Specify criteria that can be used to judge the final product or service that your project delivers
- List restrictions or constraints to be placed on the deliverable and how to build it; remember that this is intended to restrict the number of solutions that will meet a set of requirements.

#### User Requirements:
- Describes what the user needs to do with the system (links to FR)
- Focus is on the user experience with the system under all scenarios

#### Technical Requirements:
- These emerge from the functional requirements to answer the questions: 
-- How will the problem be solved this time and will it be solved technologically and/or procedurally? 
-- Specify how the system needs to be designed and implemented to provide required functionality and fulfill required operational characteristics.

> Let’s move on to the key functional requirements of our system. Firstly, we will implement a secure login system for department heads, staff, and instructors. This ensures that only authorized users can access the system, protecting sensitive data. I think this is crucial because it not only protects the privacy of the users but also ensures that the integrity of the data is maintained. By restricting access to authorized personnel, we can prevent unauthorized changes and potential misuse of the system.


## Tech Stack
> Identify the “tech stack” you are using. This includes the technology the user is using to interact with your software (e.g., a web browser, an iPhone, any smartphone, etc.), the technology required to build the interface of your software, the technology required to handle the logic of your software (which may be part of the same framework as the technology for the interface), the technology required to handle any data storage, and the programming language(s) involved. You may also need to use an established API, in which case, say what that is. (Please don’t attempt to build your API in this course as you will need years of development experience to do it right.) You can explain your choices in a paragraph, in a list of bullet points, or a table. Just make sure you identify the full tech stack.
> For each choice you make, provide a short justification based on the current trends in the industry. For example, don’t choose an outdated technology because you learned it in a course. Also, don’t choose a technology because one of the team members knows it well. You need to make choices that are good for the project and that meet the client’s needs, otherwise, you will be asked to change those choices.  Consider risk analysis. 

## High-level risks

> Describe and analyze any risks identified or associated with the project. 

## Assumptions and constraints

> What assumptions is the project team making and what are the constraints for the project?

## Summary milestone schedule

> Identify the major milestones in your solution and align them to the course timeline. In particular, what will you have ready to present and/or submit for the following deadlines? List the anticipated features you will have for each milestone, and we will help you scope things out in advance and along the way. Use the table below and just fill in the appropriate text to describe what you expect to submit for each deliverable. Use the placeholder text in there to guide you on the expected length of the deliverable descriptions. You may also use bullet points to clearly identify the features associated with each milestone (which means your table will be lengthier, but that’s okay).  The dates are correct for the milestones.

|  Milestone  | Deliverable |
| :-------------: | ------------- |
|  May 29th  | Project Plan Submission |
| May 29th  | A short video presenation decribing the user groups and requirements for the project.  This will be reviewed by your client and the team will receive feedback. |
| June 5th  | Design Submission: Same type of description here. Aim to have a design of the project and the system architecture planned out. Use cases need to be fully developed.  The general user interface design needs to be implemented by this point (mock-ups). This includes having a consistent layout, color scheme, text fonts, etc., and showing how the user will interact with the system should be demonstrated. |
| June 5th  |  A short video presenation decribing the design for the project.  This will be reviewed by your client and the team will receive feedback. |
| June 14th  | Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have 3 features working for this milestone (e.g., user log-in with credentials and permissions counts as 1 feature). Remember that features also need to be tested.  |
| July 5th  | MVP Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have close to 50% of the features working for this milestone.  Remember that features also need to be tested. Clients will be invited to presentations.|
| July 19th  | Peer testing and feedback: Aim to have an additional two features implemented and tested **per** team member. As the software gets bigger, you will need to be more careful about planning your time for code reviews, integration, and regression testing. |
| August 2nd  | Test-O-Rama: Full scale system and user testing with everyone |
| August 9th  |  Final project submission and group presentions: Details to follow |

## Teamwork Planning and Anticipated Hurdles
> Based on the teamwork icebreaker survey, talk about the different types of work involved in a software development project. Start thinking about what you are good at as a way to get to know your teammates better. At the same time, know your limits so you can identify which areas you need to learn more about. These will be different for everyone. But in the end, you all have strengths and you all have areas where you can improve. Think about what those are, and think about how you can contribute to the team project. Nobody is expected to know everything, and you will be expected to learn (just some things, not everything).
> Use the table below to help line up everyone’s strengths and areas of improvement together. The table should give the reader some context and explanation about the values in your table.
> 
> For **experience** provide a description of a previous project that would be similar to the technical difficulty of this project’s proposal.  None, if nothing
> For **good At**, list of skills relevant to the project that you think you are good at and can contribute to the project.  These could be soft skills, such as communication, planning, project management, and presentation.  Consider different aspects: design, coding, testing, and documentation. It is not just about the code.  You can be good at multiple things. List them all! It doesn’t mean you have to do it all.  Don’t ever leave this blank! Everyone is good at something!

|  Category  | Yiyang Du| Dichen Feng  | Marshall Kwok Guo | Vaughn Janes | Jiayao Ni |
|------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|  **Experience**  |  |  |  | I've been making a website for a RuneLite plugin which displays a globally-sourced visual heatmap of where players walk (and other stuff) |  |  | 
|  **Good At**  |  |  |  | Back-end stuff, such as SQL, serverside code, and setting up the Docker environment/containers |  |  | 
|  **Expect to learn**  |  |  |  | Brushing up on front-end stuff (javascript), and using Python as the P in a LAMP stack (I know Python but haven't used it for web dev)|  |  | 
|  **"Expect to learn" original text (delete this row when we're done)**  | Don’t ever leave this blank! We are all learning.  | Understanding your limits is important. Where do you expect you will need help? | It may not be technical skills. You may be a good coder but never worked with people in a team. Maybe you built a web- site but not used a framework. | It may also be a theoretical concept you already learned but never applied in practice. | Think about different project aspects: design, data security, web security, IDE tools, inte- gration testing, CICD, etc. There will be something. | Don’t ever leave this blank! We are all learning. | 

> Use this opportunity to discuss with your team who **may** do what in the project. Make use of everyone’s skill set and discuss each person’s role and responsibilities by considering how everyone will contribute.  Remember to identify project work (some examples are listed below at the top of the table) and course deliverables (the bottom half of the table). You might want to change the rows depending on what suits your project and team.  Understand that no one person will own a single task.  Recall that this is just an incomplete example.  Please explain how things are assigned in the caption below the table, or put the explanation into a separate paragraph so the reader understands why things are done this way and how to interpret your table. 


|  Category of Work/Features  | Yiyang Du | Dichen Feng   | Marshall Kwok Guo  | Vaughn Janes  | Jiayao Ni | 
| ------------- | :-------------: | :-------------: | :-------------: | :-------------: | :-------------: | 
|  **Project Management: Kanban Board Maintenance**  |  |  |  | :heavy_check_mark: |  |
|  **System Architecture Design**  |  |  |  | :heavy_check_mark: |  | 
|  **User Interface Design**  |  |  |  |  |  |
|  **CSS Development**  |  |  |  |  |  | 
|  **Serverside development**  |  |  |  | :heavy_check_mark: |  | 
|  **Feature 1**  |  |  |  |  |  | 
|  **Feature 2**  |  |  |  |  |  | 
|  **...**  |  |  |  |  |  |
|  **Database setup**  |  |  |  | :heavy_check_mark: |  | 
|  **Presentation Preparation**  |  |  |  |  |  | 
|  **Design Video Creation**  |  |  |  | :heavy_check_mark: |  | 
|  **Design Video Editing**  |  |   |  | :heavy_check_mark: |  | 
|  **Design Report**  |  |  |  |  |  | 
|  **Final Video Creation**  |  |  |  | :heavy_check_mark: |  | 
|  **Final Video Editing**  |  |  |  | :heavy_check_mark: |  | 
|  **Final Team Report**  |  |  |  |  |  | 
|  **Final Individual Report**  |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: |
