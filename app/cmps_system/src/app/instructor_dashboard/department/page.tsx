'use client'
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Image from "next/image";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavbarBrand from 'react-bootstrap/NavbarBrand';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/esm/Card";
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavDropdown, NavLink, NavbarCollapse, NavbarText, Row, Table } from "react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState } from "react";
import { TableContainer } from "@mui/material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function Home() {
    const columns1 = [
        
        { field: 'course_name', headerName: 'Course Name', width: 100 },
        { field: 'name', headerName: 'Staff Name', width: 100 },
        { field: 'role_description', headerName: 'Role/Course Description', width: 250 },
    ];

    const rows1 = [
        { id: 1, course_name: 'COSC414', name: 'Snow Jon', role_description: "instructor" },
        { id: 2, course_name: 'COSC214', name: 'Meow', role_description: "English cat instructor" },
        { id: 3, course_name: 'COSC114', name: 'Meo', role_description: "Tieng Viet cat instructor" },
        { id: 4, course_name: 'COSC514', name: 'Mao', role_description: "Chinese cat instructor" },
        { id: 5, course_name: 'COSC614', name: 'Miao', role_description: "Chinese cat instructor" },
        { id: 6, course_name: 'COSC714', name: 'Snow Jon II', role_description: "son of instructor" },
        { id: 7, course_name: 'COSC814', name: 'Marshall', role_description: "mentor of cats" },
    ];
    const columns2 = [
        { field: 'role_name', headerName: 'Role', width: 120 },
        { field: 'name', headerName: 'Staff Name', width: 120 },
        
        { field: 'time', headerName: 'Term', width: 100 },
        { field: 'student_count', headerName: 'Student Number', width: 150 },
    ];

    const rows2 = [
        { id: 1, role_name: 'cs advisor', name: 'Snow Jon', time: '2023S_T1', student_count: '100' },
        { id: 2, role_name: 'math advisor', name: 'Snow Jon 2', time: '2024W_T2', student_count: '1200' },
        { id: 3, role_name: 'cs advisor', name: 'Snow Jon 3', time: '2024W_T1', student_count: '1030' },
    ];
    return (
        <main>
            <Navbar style={{ backgroundColor: "#002145" }} expand="lg">
                <Container>
                    <NavbarBrand><b className="tw-text-white">Staff Dashboard</b></NavbarBrand>
                    <Nav className="me-auto">
                        <NavLink href="/instructor_dashboard/individual"><span className="tw-text-white">Individual</span></NavLink>
                        <NavLink href="/instructor_dashboard/department"><span className="tw-text-white tw-font-bold">Department</span></NavLink>
                    </Nav>
                    <Nav justify-content-end>
                        <NavLink><span className="tw-text-white">Logout</span></NavLink>
                    </Nav>
                </Container>
            </Navbar>

            <Container>
                <Row>
                    <Col xs={6}>
                        <div className="tw-mt-6">
                            <DataGrid
                                rows={rows1}
                                columns={columns1}
                            
                                pageSizeOptions={[5000000]}

                            />
                        </div>
                    </Col>

                    {/* <Col xs={6}>
                    <div className="tw-mt-6">
                            <DataGrid
                                rows={rows2}
                                columns={columns2}
                            
                                pageSizeOptions={[5000000]}

                            />
                        </div>

                    </Col>
                </Row>
            </Container>
        </main>
    );
}
