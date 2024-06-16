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
        { field: 'serviceRoles_name', headerName: 'Service Roles', width: 100, editable: true },
        { field: 'instructor', headerName: 'Instructor', width: 200, editable: true },
        { field: 'session', headerName: 'Session', width: 200, editable: true },
        { field: 'hours', headerName: 'Hours', width: 200, editable: true },

    ]

    const [courseData, setCourseData] = useState([
        { id: 0, serviceRoles_name: "CS advisor",  instructor: "Professor Dingus", session: "2021W", hours: "200" },
        { id: 1, serviceRoles_name: "student advisor",  instructor: "Professor Dingus", session: "2021W", hours: "200" },
        { id: 2, serviceRoles_name: "Academic advisor",  instructor: "Professor Hahaha", session: "2021W", hours: "200" },
        { id: 3, serviceRoles_name: "Academic advisor",  instructor: "Professor hehehe", session: "2021W", hours: "200" },
        { id: 4, serviceRoles_name: "Academic advisor",  instructor: "Professor lalala", session: "2022W", hours: "200" },
        { id: 5, serviceRoles_name: "Academic advisor",  instructor: "Professor huhuhu", session: "2023S", hours: "200" },

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
                <Link href="/service_roles/create_new_serviceRoles" style={{ display: "flex", alignItems: "center", margin: "0 3em", fontSize: "1.5em" }}>
                    <Image src="/plus.svg" alt="Add new service roles plus icon" width={20} height={20} style={{ margin: '20px' }} />
                    Create new course
                </Link>
            </span>
            {renderTable()}
        </main >
    );
}