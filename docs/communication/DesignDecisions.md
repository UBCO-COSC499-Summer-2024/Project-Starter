# Design Decisions

This is where we keep track of decisions relating to the design of the program, its database, terminology, etc., so that we can all be on the same page when it comes to our mental maps of the program.

| Decision Number | Date | Design Decision | 
|-|-|-|
| 1 | 05/27 | We will use FastAPI, and not Flask for the server side Python web framework. |
| 2 | 05/29 | Instead of referring to the two types of users as "Department head" and "Instructors", we'll use the more generalized terms "Administrator" and "Staff", as it may not necessarily be the case that the user acting as an administrator will be the department head (for example, perhaps the department head will authorize someone else to manage the system from time to time). As well, it may be the case that a department employee isn't always an instructor; perhaps for some term, they are only an advisor and not assigned to teach a course. |
| 3 |05/29 | In the database (and the program in general), service roles and teaching assignments can collectively be referred to as "jobs". This simplifies the database schema as well as the program overall, as now the primary database tables can just be `staff`, `assign`, and `job` (and the `job` table can still have a field `job_type` to differentiate service roles from teaching assignments, if needed.)|
