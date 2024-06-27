'use client'
import Container from 'react-bootstrap/Container';
import Navbar from "@/app/components/NavBar"
import { createClient } from '@supabase/supabase-js'
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
import { useState, useEffect } from "react";
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
    useEffect(() => {
        (async () => {
            console.log(process.env.ANON_KEY)
            const supabase = createClient("https://congenial-rotary-phone-q9rgv7jp6wjcx7v4-8000.app.github.dev/", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE");
            const { data } = await supabase.from("course").select();
            console.log(data)

        })()
    }, [])

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
                <Link href="/courses/create_new_course" style={{ display: "flex", alignItems: "center", margin: "0 3em", fontSize: "1.5em" }}>
                    <Image src="/plus.svg" alt="Add new course plus icon" width={20} height={20} style={{ margin: '20px' }} />
                    Create new course
                </Link>
            </span>
            {renderTable()}
        </main >
    );
}