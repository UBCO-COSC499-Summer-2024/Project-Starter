# System Design

## Introduction

Start with a brief introduction of **what** you are building, reminding the reader of the high-level usage scenarios (project purpose).   Complete each section with the required components.  Don't forget that you can include [images in your markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images).  

Start each section with a lead-in, detailing what it is.  Also, do not just have a collection of images.   Each diagram must be explained clearly. **Do not assume that the reader understands the intentions of your designs**.

## System Architecture Design

We use Supabase for both database management and authentication because it uses PostgreSQL under the hood, doesn't require us to have a back end server at all (logic is all clientside but actions and access are authenticated by Supabase middleware), it can easily accomodate implementing CWL in the future, and it makes the architecture very simple.

![alt text](./System%20Architecture%20Diagram/System%20Architecture%20Diagram.png)

## Use Case Models

![alt text](./Use%20Case%20Diagram/Use%20Case%20Diagram.png)

## Database Design

Provide an ER diagram of the entities and relationships you anticipate having in your system (this will most likely change, but you need a starting point).  In a few sentences, explain why the data is modelled this way and what is the purpose of each table/attribute.  For this part, you only need to have ONE diagram and an explanation.



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
The above one is the login page, where you can choose what role you will be and login.

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
