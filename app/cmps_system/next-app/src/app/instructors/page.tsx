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
        { field: 'name', headerName: 'Name', width: 300, editable: true },
        { field: 'emp_number', headerName: 'Employee Number', width: 300, editable: true },
        { field: 'title', headerName: 'Title', width: 300, editable: true },
        { field: 'date_hired', headerName: 'Date Hired', width: 300, editable: true },
    ]

    const [instructorData, setInstructorData] = useState([
        { id: 0, name: "Professor Dingus", emp_number: "35235236", title: "Professor", date_hired: "2014/11/15" },
        { id: 1, name: "Dr Eggman", emp_number: "23525235", title: "Associate Professor", date_hired: "2004/03/19" },
        { id: 2, name: "Chinese Cat Instructor", emp_number: "78224355", title: "Professor", date_hired: "1776/03/25" },
        { id: 3, name: "Peter Griffin", emp_number: "46934876", title: "Associate Professor", date_hired: "2001/03/13" },
        { id: 4, name: "Joe Swanson", emp_number: "30946839", title: "Super Professor", date_hired: "1999/12/31" },
        { id: 5, name: "Quagmire", emp_number: "38467936", title: "Professor", date_hired: "3000/03/04" },
        { id: 6, name: "COSC 400", emp_number: "23985759", title: "Super Ultra Professor", date_hired: "2024/03/31" },
        { id: 7, name: "John Doe", emp_number: "12345678", title: "Assistant Professor", date_hired: "2010/05/20" },
        { id: 8, name: "Opie", emp_number: "87654321", title: "Professor", date_hired: "2018/09/10" },
        { id: 9, name: "Alice Johnson", emp_number: "98765432", title: "Professor", date_hired: "2015/02/28" },
        { id: 14, name: "Stewie Griffin", emp_number: "9876543210", title: "Professor", date_hired: "2000/01/01" },
        { id: 15, name: "Lois Griffin", emp_number: "0123456789", title: "Professor", date_hired: "1999/12/31" },
        { id: 16, name: "Meg Griffin", emp_number: "2468135790", title: "Professor", date_hired: "2002/03/15" },
        { id: 17, name: "Chris Griffin", emp_number: "1357924680", title: "Professor", date_hired: "2004/07/22" },
        { id: 18, name: "Brian Griffin", emp_number: "3692581470", title: "Talking Dog", date_hired: "2000/05/05" },
        { id: 10, name: "Bob Smith", emp_number: "123456789", title: "Assistant Professor", date_hired: "2012/09/15" },
        { id: 11, name: "Emily Davis", emp_number: "987654321", title: "Professor", date_hired: "2019/06/10" },
        { id: 12, name: "Michael Johnson", emp_number: "456789123", title: "Professor", date_hired: "2008/03/22" },
        { id: 13, name: "Sarah Thompson", emp_number: "789123456", title: "Associate Professor", date_hired: "2011/11/05" },
    ])

    const renderTable = () => {
        return (
            <Container>
                <Row className="h-32">
                    <div className="tw-p-3">
                        <DataGrid
                            editMode="row"
                            rows={instructorData}
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
                <h1 style={{ marginRight: "10px" }}>Instructors</h1>
                <Link href="/instructors/create_new_instructor" style={{ display: "flex", alignItems: "center", margin: "0 3em", fontSize: "1.5em" }}>
                    <Image src="/plus.svg" alt="Add new instructor plus icon" width={20} height={20} style={{ margin: '20px' }} />
                    Create new instructor
                </Link>
            </span>
            {renderTable()}
        </main >
    );
}