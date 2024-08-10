
# Use Case Model for CMPS Department Management System

## Overview

This document outlines the use case model for the CMPS Department Management System. It details the interactions between different user roles (Head, Staff, Instructor) and the system to manage department activities efficiently.

## Use Case Diagram


## Actors

### Head (Administrator)
- **Role**: Department head or administrative staff with full access to manage the system.
- **Responsibilities**: Logging in, managing staff profiles, roles, and performance metrics, generating reports, and exporting data.

### Staff (Department Staff)
- **Role**: Administrative staff responsible for data entry and updates.
- **Responsibilities**: Logging in, adding/editing data, importing data from CSV files, exporting data to CSV, recording department meetings.

### Instructor
- **Role**: Teaching staff with access to view their own assignments and performance metrics.
- **Responsibilities**: Signing up, logging in, viewing their profile, viewing assigned roles and courses, viewing performance metrics.

## Use Cases

### 1. Head (Administrator) Use Cases

#### 1.1 Login to System
- **Description**: Logs into the Department Management System using credentials.
- **Preconditions**: Must have a registered account.
- **Postconditions**: Gains access to the system's dashboard.

#### 1.2 Manage Staff Profiles
- **Description**: Creates, updates, or deletes staff profiles.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Staff profile data is updated in the system.

#### 1.3 Manage Roles and Assignments
- **Description**: Assigns or modifies roles and teaching assignments for staff members.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Assignments are updated in the system's database.

#### 1.4 Enter Performance Metrics
- **Description**: Enters or updates performance metrics for staff members.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Performance metrics are stored and updated in the system.

#### 1.5 Generate Reports and Visualizations
- **Description**: Generates reports and visualizations of staff performance and department metrics.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Reports and visualizations are generated and available for review.

#### 1.6 Manage User Accounts
- **Description**: Manages user accounts, including creating, deleting, and resetting passwords.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: User account data is updated.

#### 1.7 Export Data to Excel
- **Description**: Exports various data types (service roles, course assignments) to Excel for further analysis.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Data is exported in Excel format.

#### 1.8 Logout
- **Description**: Logs out of the system.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Session is terminated.

### 2. Department Staff Use Cases

#### 2.1 Login to System
- **Description**: Logs into the Department Management System using credentials.
- **Preconditions**: Must have a registered account.
- **Postconditions**: Gains access to the system's dashboard.

#### 2.2 Add/Edit Data
- **Description**: Adds or edits data related to instructors, courses, and assignments.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Data is updated in the system.

#### 2.3 Import Data from CSV
- **Description**: Imports data related to courses and TA assignments from CSV files.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Data is imported and updated in the system.

#### 2.4 Export Data to CSV
- **Description**: Exports various data types to CSV for further analysis.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Data is exported in CSV format.

#### 2.5 Record Department Meeting
- **Description**: Records department meetings and attendees.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Meeting data is recorded and stored in the system.

#### 2.6 Logout
- **Description**: Logs out of the system.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Session is terminated.

### 3. Instructor Use Cases

#### 3.1 Sign Up
- **Description**: Creates a new account on the system.
- **Preconditions**: Must have a valid email address.
- **Postconditions**: A new user account is created and activated.

#### 3.2 Login to System
- **Description**: Logs into the system using credentials.
- **Preconditions**: Must have a registered account.
- **Postconditions**: Gains access to the system's dashboard.

#### 3.3 View Own Profile
- **Description**: Views their own profile, including personal information and assigned roles.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Profile data is displayed.

#### 3.4 View Assigned Roles and Courses
- **Description**: Views the roles and courses they have been assigned to.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Assigned roles and courses are displayed.

#### 3.5 View Performance Metrics
- **Description**: Views their performance metrics and comparisons with departmental averages.
- **Preconditions**: Must be logged into the system and have permission to view their metrics.
- **Postconditions**: Performance metrics are displayed.

#### 3.6 Logout
- **Description**: Logs out of the system.
- **Preconditions**: Must be logged into the system.
- **Postconditions**: Session is terminated.
