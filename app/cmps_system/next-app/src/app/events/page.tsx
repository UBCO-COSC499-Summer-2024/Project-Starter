'use client'
import Container from 'react-bootstrap/Container';
import Navbar from "@/app/components/NavBar"
import Link from 'next/link';
import Image from 'next/image';
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
        { id: 0, course_name: "COSC 400", location: "FIP 123", instructor: "Professor Dingus", num_students: 120, num_TAs: 4, average_grade: 70, year_level: 4, session: "2021W" },
        { id: 1, course_name: "PHYS 301", location: "EME 211", instructor: "Joe Swanson", num_students: 75, num_TAs: 2, average_grade: 71, year_level: 3, session: "2024W" },
        { id: 2, course_name: "COSC 202", location: "ART 255", instructor: "Peter Griffin", num_students: 60, num_TAs: 2, average_grade: 69, year_level: 2, session: "2005W" },
        { id: 3, course_name: "COSC 103", location: "FIP 108", instructor: "Winston Churchill", num_students: 15, num_TAs: 1, average_grade: 75, year_level: 1, session: "2021W" },
        { id: 4, course_name: "PHYS 101", location: "SCI 118", instructor: "Albert Einstein", num_students: 50, num_TAs: 2, average_grade: 80, year_level: 1, session: "2022S" },
        { id: 5, course_name: "MATH 200", location: "FIP 227", instructor: "Isaac Newton", num_students: 80, num_TAs: 3, average_grade: 85, year_level: 2, session: "1999W" },
        { id: 6, course_name: "STAT 300", location: "SCI 217", instructor: "Ada Lovelace", num_students: 70, num_TAs: 2, average_grade: 78, year_level: 3, session: "2022W" },
        { id: 7, course_name: "COSC 101", location: "FIP 120", instructor: "Marie Curie", num_students: 40, num_TAs: 1, average_grade: 82, year_level: 1, session: "2022S" },
        { id: 8, course_name: "STAT 200", location: "EME 254", instructor: "Charles Darwin", num_students: 60, num_TAs: 2, average_grade: 88, year_level: 2, session: "2022W" },
        { id: 9, course_name: "COSC 300", location: "EME 240", instructor: "Sigmund Freud", num_students: 50, num_TAs: 2, average_grade: 76, year_level: 3, session: "2020W" },
        { id: 10, course_name: "MATH 101", location: "EME 115", instructor: "Albert Einstein", num_students: 30, num_TAs: 1, average_grade: 85, year_level: 1, session: "2022S" },
        { id: 11, course_name: "COSC 200", location: "FIP 227", instructor: "William Shakespeare", num_students: 70, num_TAs: 3, average_grade: 90, year_level: 2, session: "2022W" },
        { id: 12, course_name: "MATH 300", location: "SCI 215", instructor: "Adam Smith", num_students: 60, num_TAs: 2, average_grade: 80, year_level: 3, session: "2021W" },
        { id: 13, course_name: "COSC 101", location: "ART 123", instructor: "Leonardo da Vinci", num_students: 40, num_TAs: 1, average_grade: 75, year_level: 1, session: "2022S" },
        { id: 14, course_name: "MUSC 200", location: "FIP 224", instructor: "Wolfgang Amadeus Mozart", num_students: 50, num_TAs: 2, average_grade: 85, year_level: 2, session: "2022W" },
        { id: 15, course_name: "MATH 300", location: "SCI 214", instructor: "Socrates", num_students: 70, num_TAs: 2, average_grade: 78, year_level: 3, session: "2024W" },
        { id: 16, course_name: "STAT 101", location: "ART 116", instructor: "Karl Marx", num_students: 40, num_TAs: 1, average_grade: 82, year_level: 1, session: "2022S" },
        { id: 17, course_name: "COSC 200", location: "SCI 220", instructor: "Alexander von Humboldt", num_students: 60, num_TAs: 2, average_grade: 88, year_level: 2, session: "2022W" },
        { id: 18, course_name: "COSC 300", location: "ART 218", instructor: "Margaret Mead", num_students: 50, num_TAs: 2, average_grade: 76, year_level: 3, session: "2022W" },
        { id: 19, course_name: "MATH 101", location: "FIP 120", instructor: "Confucius", num_students: 30, num_TAs: 1, average_grade: 85, year_level: 1, session: "2020S" },
        { id: 20, course_name: "STAT 200", location: "ART 224", instructor: "Maria Montessori", num_students: 70, num_TAs: 3, average_grade: 90, year_level: 2, session: "2019W" },
    ]);

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
        <main>
            <Navbar />
            <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h1 style={{ marginRight: "10px" }}>Courses</h1>
                <Link href="/events/create_new_events" style={{ display: "flex", alignItems: "center", margin: "0 3em", fontSize: "1.5em" }}>
                    <Image src="/plus.svg" alt="Add new course plus icon" width={20} height={20} style={{ margin: '20px' }} />
                    Create new course
                </Link>
            </span>
            {renderTable()}
        </main >
    );
}