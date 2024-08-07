# CMPS Management System Help Document

## Overview

The CMPS Management System is a comprehensive web application designed to manage courses, instructors, evaluations, service roles, and time tracking. This document provides a detailed guide on using the system, focusing on the functionalities available to end-users.

## Table of Contents

- [Overview](#overview)
- [Dashboard](#dashboard)
- [Courses](#courses)
- [Instructors](#instructors)
- [Evaluations](#evaluations)
- [Service Roles](#service-roles)
- [Time Tracking](#time-tracking)
- [Account](#account)
- [Tools](#tools)
- [Help](#help)
- [Login](#login)
- [FAQ](#faq)
- [Bulk Import and CSV Editing](#bulk-import-and-csv-editing)

## Dashboard

The **Dashboard** provides a high-level overview of the system's status, key metrics, and recent activities. Here, you can quickly access important information and navigate to different sections of the application. A key feature of the Dashboard is the widget showing the total service hours logged by the department versus the benchmark for the current month.

## Courses

- **Courses Page:** View a list of all courses in the system. You can see basic details about each course and access more detailed information by clicking on a specific course.
- **Course Info:** Provides detailed information about a specific course, including enrolled instructors and associated evaluations.
- **Create New Course:** If you have the necessary permissions, you can create a new course by entering relevant details.

## Instructors

- **Instructors Page:** View a list of all instructors in the system. You can see basic details about each instructor and access more detailed information by clicking on a specific instructor.
- **Instructor Info:** Provides detailed information about a specific instructor, including associated courses and evaluations.
- **Create New Instructor:** If you have the necessary permissions, you can create a new instructor by entering relevant details.

## Evaluations

The **Evaluations** section allows you to manage and view evaluation data comprehensively.

- **Evaluations Page:** View a list of all evaluations in the system. You can see basic details and access more detailed information by clicking on a specific evaluation.
- **Create New Evaluation Type:** If you have the necessary permissions, you can create a new evaluation type by specifying its attributes.
- **Enter Evaluation:** Provides an interface for entering new evaluation results.
- **Evaluation Types:** View a list of all evaluation types.
- **Evaluation Type Info:** Provides detailed information about a specific evaluation type.

### Visualization of Evaluation Results

The **Evaluations Page** enables powerful visualizations to help you analyze evaluation results. You can:

- **View and Compare Results:** Compare evaluation results for specific individuals or the entire department.
- **Across Time:** Analyze how evaluations have changed over time.
- **Across Entities:** Compare evaluations across instructors, service roles, and courses.
- **Aggregated Data:** View data aggregated as averages, minimums, maximums, and other statistical measures.

These visualizations help in making informed decisions based on comprehensive evaluation data.

## Service Roles

- **Service Roles Page:** View a list of all service roles in the system. You can see basic details and access more detailed information by clicking on a specific role.
- **Create New Service Role:** If you have the necessary permissions, you can create a new service role by entering relevant details.
- **Service Role Info:** Provides detailed information about a specific service role.

## Time Tracking

- **Time Tracking Page:** View and manage tracked time. This section provides an overview of time tracking activities.
- **Benchmarks:** Manage and view benchmarks for performance tracking.
- **Events:** View a list of all events related to time tracking.
- **Create New Event:** If you have the necessary permissions, you can create a new event by entering relevant details.
- **Event Info:** Provides detailed information about a specific event.

## Account

- **Account Page:** View and manage your account settings.
- **Change Password:** Change your account password securely.

## Tools

- **Tools Page:** Access various administrative tools available in the system.
- **Change Account Password:** Change the password for a specific account.
- **Create New Account:** If you have the necessary permissions, you can create a new user account.
- **Delete an Account:** If you have the necessary permissions, you can delete a user account.
- **Export:** Export data from the system.

## Help

- **Help Page:** View this help document for guidance on using the system.
- **GPT:** Interface for AI-based assistance, allowing you to ask questions and receive automated responses.

## Login

- **Login Page:** Enter your credentials to access the system.
- **Forgot Password:** Reset your password if you have forgotten it.
- **Update Password:** Update your password after logging in.

## Bulk Import and CSV Editing

The **CMPS Management System** allows users to efficiently manage data through bulk import and direct CSV editing features.

### Bulk Import

1. **Upload CSV**: Navigate to the relevant page (e.g., Courses, Instructors) and look for the "Upload CSV" button. Click it to select a CSV file from your computer.
2. **CSV Import Process**: The system reads the uploaded CSV file and displays a before-and-after comparison of the changes that will be applied. It highlights:
   - **Additions**: New rows that will be added.
   - **Modifications**: Existing rows that will be updated.
3. **Unique Constraints**: The system checks for unique constraints and warns you if there are conflicts:
   - **Existing Unique Entries**: Warnings are shown if the imported CSV contains rows with fields that must be unique but already exist in the database.
   - **Duplicate Entries**: Warnings are shown if the imported CSV contains duplicate rows for fields that must be unique.

### CSV Editing

1. **Edit as CSV**: Navigate to the relevant page and click the "Edit As CSV" button. The current data is presented in a CSV format for editing.
2. **Make Changes**: Edit the CSV data directly in the provided text area.
3. **Apply Changes**: After making the changes, click the "Apply" button. The system displays a before-and-after comparison similar to the bulk import process, highlighting additions, modifications, and deletions.

### Download CSV

1. **Download CSV**: Navigate to the relevant page and click the "Download CSV" button to download the current data in CSV format.
2. **CSV File**: The downloaded file contains all the data visible on the page, ready for offline analysis or editing.

### Detailed Comparison and Warnings

- **Before-and-After View**: The system shows a detailed comparison before applying any changes, helping you review the exact differences.
- **Unique Key Violations**: If there are any unique key violations (either in the current data or the uploaded CSV), the system provides detailed warnings and prevents the import or changes until resolved.

### Error Handling

- **Error Messages**: Any errors encountered during the import or editing process are displayed to the user, detailing the issues and the affected rows.
- **Confirmation Dialogs**: The system uses confirmation dialogs to ensure that users are aware of the impact of their actions, especially for deletions or bulk changes.

## FAQ

### How can instructors use the system to get an overview of their assignments and status?

Instructors can log in with their user ID and password. They can retrieve forgotten passwords via email. Once logged in, they can view their own data, including course and service assignments, but cannot edit their profiles. Visualizations are available to compare their data against department benchmarks. They can also see service and course assignments for the entire department, with filtering options by subject or area.

### How can department heads get an overview of overall department performance?

Department heads can log in and use the **Evaluations Page** to access comprehensive visualizations. These visualizations allow them to compare evaluation results across the department, view data over time, and aggregate information as averages, minimums, and maximums. Additionally, the Dashboard widget displays the total service hours logged by the department versus the benchmark for the current month, helping them monitor departmental performance at a glance.

### How can department staff efficiently add or edit data related to instructors, courses, TAs, and assignments?

Department staff can use the user interface to enter service assignments and can import course and TA assignments via CSV files. The system supports re-importing data for the same year and detecting changes with user approval. Course performance and SEI data can also be imported through CSV files. Staff can record department meetings and attendees quickly, export data into CSV/Excel, and request instructors to provide TA reviews.

### How does the CSV import feature help with updating existing data?

When you import a CSV file, the system compares the existing data with the new data from the CSV file:

- **Modifications**: It detects any modifications to existing rows and highlights these changes.
  - An existing row is modified when an imported row shares the same unique key (as listed in the Edit as CSV dialog) OR primary key (usually named `table_name_id`) as the existing row.
  - The primary key field can be left empty for imported rows, and the existing row-to-be-updated will be detected based on the unique key, IF the table has a unique key.
  - The primary key takes precedence over the unique key. If a row exists in the database with the primary ID being imported, then the rest of the row will be updated, including its unique key. If the existing row's unique key is being updated to a unique key which already exists elsewhere in the table, an error will be shown and the user will be prevented from continuing.
- **Additions**: New rows that do not exist in the current data are identified (as per the primary ID or unique fields) and added.
- **Deletions**: Importing a CSV cannot delete existing data.
- **Unique Constraints**: The system checks for unique constraints and warns if there are conflicts, such as duplicate entries or unique key violations.
- **Before-and-After Comparison**: Before applying the changes, a detailed before-and-after comparison is shown, allowing users to review and confirm the changes.

### What are the capabilities of system administrators?

System administrators can add, edit, or delete accounts and perform system maintenance. If an account is not active or eligible for login, its data is retained for historical analysis. System administrators may also be department heads or staff.