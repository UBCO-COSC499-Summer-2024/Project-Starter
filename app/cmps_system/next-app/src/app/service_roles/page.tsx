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
        { field: 'service_role_name', headerName: 'Service Role', width: 200, editable: true },
        { field: 'description', headerName: 'Description', width: 300, editable: true },
        { field: 'hours', headerName: 'Default Monthly Hours', width: 200, editable: true },
        { field: 'assignees', headerName: 'Number of Assignees', width: 200, editable: true }

    ]

    const [courseData, setCourseData] = useState([
        { id: 0, service_role_name: "Undergraduate Advisor", description: "An advisor for undergraduate students", hours: "20", assignees: "2" },
        { id: 1, service_role_name: "Graduate Advisor", description: "An advisor for graduate students", hours: "10", assignees: "1" },
        { id: 2, service_role_name: "Service Role C", description: "blah blah blah", hours: "15", assignees: "2" },
        { id: 3, service_role_name: "Service Role D", description: "blah blah blah", hours: "25", assignees: "1" },
        { id: 4, service_role_name: "Service Role E", description: "blah blah blah", hours: "20", assignees: "3" },
        { id: 5, service_role_name: "Service Role F", description: "blah blah blah", hours: "15", assignees: "2" },

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
                <h1 style={{ marginRight: "10px" }}>Service Roles</h1>
                <Link href="/service_roles/create_new_service_role" style={{ display: "flex", alignItems: "center", margin: "0 3em", fontSize: "1.5em" }}>
                    <Image src="/plus.svg" alt="Add new service roles plus icon" width={20} height={20} style={{ margin: '20px' }} />
                    Create new service role
                </Link>
            </span>
            {renderTable()}
        </main >
    );
}