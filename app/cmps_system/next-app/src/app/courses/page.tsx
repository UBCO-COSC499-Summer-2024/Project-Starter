'use client'
import Container from 'react-bootstrap/Container';
import Navbar from "@/app/components/NavBar"
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormControl, FormLabel, Modal, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle, NavDropdown, NavLink, NavbarCollapse, NavbarText, Row, Table } from "react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import React from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Home() {
    const tableColumns = [
        { field: 'course_name', headerName: 'Course', width: 100, editable: true },
        { field: 'location', headerName: 'Location', width: 200, editable: true },
        { field: 'instructor', headerName: 'Instructor', width: 200, editable: true },
        { field: 'num_students', headerName: 'Number of Students', width: 200, editable: true },
        { field: 'num_TAs', headerName: 'Number of TAs', width: 200, editable: true },
        { field: 'average_grade', headerName: 'Average Grade', width: 200, editable: true },
        { field: 'year_level', headerName: 'Year Level', width: 200, editable: true },
        { field: 'session', headerName: 'Session', width: 200, editable: true },
    ]

    const [courseData, setCourseData] = useState([
        { id: 0, course_name: "COSC 400", location: "FIP 120", instructor: "Professor Dingus", num_students: 120, num_TAs: 4, average_grade: 70, year_level: 4, session: "2021W" },
        { id: 1, course_name: "COSC 301", location: "COM 210", instructor: "Joe Swanson", num_students: 75, num_TAs: 2, average_grade: 71, year_level: 3, session: "2021W" },
        { id: 2, course_name: "COSC 202", location: "ART 250", instructor: "Peter Griffin", num_students: 60, num_TAs: 2, average_grade: 69, year_level: 2, session: "2021W" },
        { id: 3, course_name: "COSC 103", location: "FIP 102", instructor: "Winston Churchill", num_students: 15, num_TAs: 1, average_grade: 75, year_level: 1, session: "2021W" }
    ])

    const renderTable = () => {
        return (
            <Container>
                <Row className="h-32">
                    <div className="tw-p-3">
                        <DataGrid
                            editMode="row"
                            rows={courseData}
                            columns={tableColumns}
                            pageSizeOptions={[10000]}
                        />
                    </div>
                </Row>
            </Container>
        );
    }
    return (
        < main >
            <Navbar />
            <h1>Courses</h1>
            {renderTable()}
        </main >
    );
}