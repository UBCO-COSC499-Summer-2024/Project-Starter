# System Design

## Introduction

We are developing a comprehensive system designed to manage and track various aspects of the UBCO CMPS Department and its instructors. This system primarily focuses on monitoring instructor performance metrics, managing billable events such as meetings and other activities, and facilitating the assignment and tracking of service roles and course assignments for instructors. The system aims to simplify and streamline the processes involved in logging hours, evaluating performance, and managing events, ensuring that all relevant data is accurately recorded and easily accessible for reporting, analysis, and visualization.

## System Architecture Design

We use Supabase for both database management and authentication because it uses PostgreSQL under the hood, doesn't require us to have a back end server at all (logic is all clientside but actions and access are authenticated by Supabase middleware), it can easily accomodate implementing CWL in the future, and it makes the architecture very simple.

![alt text](./System%20Architecture%20Diagram/System%20Architecture%20Diagram.png)

## Use Case Models

![alt text](./Use%20Case%20Diagram/Use%20Case%20Diagram.png)

## Database Design

This is our ER diagram which enables our program to have a number of features. Events such as meetings can be created as entries in the `event` table, having a specified duration, and instructors can be recorded as having attended this meeting (for a specific amount of time, if desired, but by default will be for the same duration as the meeting). An important reason for including the `event` table instead of having meeting hours be kept track of simply by adding hours onto a set of instructors' total hours for a given month, is that meetings can easily be deleted or edited without needing to keep track of whose hours had been altered (and possibly messed up).

Of course, instructors can be simply assigned to existing service roles via the `service_role_assign` table. Instructors can also be assigned to courses in much the same way, but also with an enumerable field `position` which can take on the values "professor" or "TA" (and perhaps other positions if desired) in order to help keep track of course TAs in addition to, and separate from, professors.

Another important feature enabled by the database's schema is the ability to natively accomodate new future performance metrics (in addition to just the current SEI results), which can be either of a singular numeric format (e.g. a "rating"), or a survey format just like the SEI. As well, it only needs one table to store both types of metrics (turns out they're not that different when it comes down to it).

Separate tables are used to keep track of evaluation types and evaluation metrics (aka the generic name for "survey question"), in order to enforce data integrity—that is, it prevents evaluation metric descriptions from becoming inconsistent across an evaluation type. Evaluation entries can correspond to a course, an instructor, or both simultaneously.

Courses are kept track of on a subject-code-section-year-session-term-campus basis, so that when instructors are assigned to a course such as COSC 360, it is a specific COSC 360 course with a corresponding location, number of students, mode of delivery, etc. (if defined), rather than some abstract "COSC 360". There are plenty of metadata tags for courses in order to support viewing statistics/metrics for any specific subset of courses.

![](./ER%20Diagram/ER%20Diagram.png)

## Data Flow Diagram (Level 0/Level 1)

### Level 0

This Level 0 Data Flow Diagram (DFD) depicts the interactions between the Instructor, the Department Management System, and the Department Head/Department Staff within an educational institution. 

In this diagram, the instructor can do the following:

- The instructor's credentials are validated by the Department Management System.
- The instructor receives their service role from the department head or the department staff.
- The instructor views their expected working hours from the Department Management System.
- The instructor views their performance data through the Department Management System.

And the Department Head and Staff can do the following:

- The department head/staff undergo user validation by the system.
- The department head/staff input the service roles into the Department Management System.
- The department head/staff log expected monthly hours for the instructors into the system.
- The department head/staff manage performance data within the system.
- The department head/staff create and log meeting hours into the system.
- The department head/staff create course assignments within the system.

For the departemnt manage system, This is the central system that manages various operations and data flows between instructors and the department head/staff. It contains the following interactions:

- The department head/staff enters service roles into the system.
- The department head/staff enter the monthly working hours of the instructors.
- The system validates the credentials of both instructors and department head/staff.
- The system manages performance data for instructors.
- The system logs meeting hours.
- The system allows the creation of course assignments.



![level_0](./DFD%20Diagram/DFD_level_0.png)

### Level 1
This Level 1 Data Flow Diagram (DFD) provides a more detailed view of the processes and data interactions within the system, involving the Instructor, Department Head/Staff, and various system components.

First, the instructor, department head and department staff need to g0 through the authentication process inorder to log in to the system. 

Once authenticated, instructors can view their service roles, log hours, view performance data, and view course assignments. And the department head/staff can assign service role, entering monthly hours, manage performance data, log meeting hours and create course assignments.All these operations are done through the dashboard of instructor or admin.  

The instructor dashboard interfaces with the database to access performance data, log hours, service roles, and course assignments for the instructors.

The admin dashboard is used by department heads or staff to assign service roles, enter monthly hours, manage performance data, log meeting hours, and create course assignments. This dashboard stores and retrieves necessary information into or from the database.

Lastly, about the database. The database stores and provides access to log hours, performance data, service roles, and course assignments. The database also retrieves data for both the instructor and admin dashboards.

![level_1](./DFD%20Diagram/DFD_level_1.png)

## User Interface (UI) Design

![](./UI%20Mockups/Login_Signup%20Page/Login%20Page.png)
The above image is the login page, where you can choose what role you will be and log in.

![](./UI%20Mockups/Dashboard/Dept%20Head%20Dashboard%201.png)
The above image is the dashboard for the department head. The chart on the left shows the average working hours of every instructor in the department. The chart on the right shows the SEI rating distributions.

![](./UI%20Mockups/Dashboard/Dept%20Head%20Dashboard%202.png)
The above image is the dashboard for the department head. The table on the left lists some of the existing service roles along with their descriptions, and the table on the right lists some instructors along with any service roles and teaching assignments they have.

![](./UI%20Mockups/Dashboard/Dept%20Head%20Dashboard%203.png)
The above image shows how a department head can create a new service role with a description.

![](./UI%20Mockups/Dashboard/Dept%20Head%20Dashboard%204.png)
The above image shows how a department head can import many service roles at once via a CSV file.

![](./UI%20Mockups/Dashboard/Dept%20Head%20Dashboard%205.png)
The above image shows how a department head can manage the student survey results for every instructor (we can pretend that they're not all named Bob and are for the same course). The table title "Roles Management" is an error in the mock up.

![](./UI%20Mockups/Dashboard/Staff%20Dashboard.png)
The above image is the dashboard for department staff, showing department level information such as an overview on which instructors are assigned to what courses, as well as an overview of their performance metrics ("Rating" would probably be replaced by SEI results)

![](./UI%20Mockups/Dashboard/Instructor%20Dashboard.png)
The above image is the dashboard for instrucors to see their own information, such as service role assignments, service role hours, teaching assignments, and SEI score.

![](./UI%20Mockups/Service%20Role%20Page/Service%20Role%20Page.png)
The above image shows the information page for a service role.

![](./UI%20Mockups/Course%20Page/Course%20Page.png)
The above image shows the information page for a course.
