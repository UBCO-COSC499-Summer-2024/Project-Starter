'use client'
import Image from "next/image";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavbarBrand from 'react-bootstrap/NavbarBrand';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/esm/Card";
import { csv2json, json2csv } from 'json-2-csv';
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
import { Bar } from 'react-chartjs-2';
import { useRef, useState } from "react";
import { FormGroup, TableContainer } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);



export default function Home() {
    const role_columns = [
        { field: 'name', headerName: 'Role Name', width: 150, editable: true },
        { field: 'des', headerName: 'Role Description', width: 300, editable: true },
    ]

    const [roleData, setRoleData] = useState([
        { id: 1, name: "COSC101", des: "Course COSC101", },
        { id: 2, name: "Grad Advisor", des: "Grad Advisor for Computer Science", },
        { id: 3, name: "Grad Advisor", des: "Grad Advisor for Math", },
        { id: 4, name: "Grad Advisor", des: "Grad Advisor for Physics", },
        { id: 5, name: "Grad Advisor", des: "Grad Advisor for Statistics", }
    ])

    const peopleColumns = [
        { field: 'name', headerName: 'Person Name', width: 100, editable: true },
        { field: 'hours', headerName: 'Hours Worked This Month', width: 200, editable: true },
        { field: 'roles', headerName: 'Roles', width: 200, editable: true },
    ]

    const [peopleData, setPeopleData] = useState([
        { id: 0, name: "Marshall", hours: 19, roles: "COSC203/COSC102/COSC502" },
        { id: 1, name: "Marshall", hours: 19, roles: "COSC203/COSC102/COSC502" },
        { id: 2, name: "Marshall", hours: 19, roles: "COSC203/COSC102/COSC502" },
        { id: 3, name: "Marshall", hours: 19, roles: "COSC203/COSC102/COSC502" },
        { id: 4, name: "Marshall", hours: 19, roles: "COSC203/COSC102/COSC502" },
    ])
    const [csv, setCSV] = useState("")
    const batchEditRole = () => {
        // console.log(json2csv(roleData))
        setCSV(json2csv(roleData))
        handleBatchShow()
    }

    const batchEditPeople = () => {
        // console.log(json2csv(roleData))
        setCSV(json2csv(roleData))
        handlePeopleBatchShow()
    }
    const [roleShow, setRoleShow] = useState(false);
    const [batchShow, setBatchShow] = useState(false);
    const [peopleShow, setPeopleShow] = useState(false);
    const [peopleBatchShow, setPeopleBatchShow] = useState(false);

    const handleRoleClose = () => setRoleShow(false);
    const handleRoleShow = () => setRoleShow(true);

    const handleBatchClose = () => setBatchShow(false);
    const handleBatchShow = () => setBatchShow(true);

    const handlePeopleBatchClose = () => setPeopleShow(false);
    const handlePeopleBatchShow = () => setPeopleShow(true);

    const handlePeopleClose = () => setPeopleBatchShow(false);
    const handlePeopleShow = () => setPeopleBatchShow(true);

    const roleName = useRef(null);
    const roleDes = useRef(null);
    return (
        <main>
            <Navbar style={{ backgroundColor: "#002145" }} expand="lg">
                <Container>
                    <NavbarBrand><b className="tw-text-white">Dept Head Dashboard</b></NavbarBrand>
                    <Nav className="me-auto">
                        <NavLink href="/head_dashboard"><span className="tw-text-white tw-font-bold">Role and People Management</span></NavLink>
                        <NavLink href="/head_dashboard"><span className="tw-text-white">Rating Management</span></NavLink>
                    </Nav>
                    <Nav justify-content-end="true">
                        <NavLink><span className="tw-text-white">Logout</span></NavLink>
                    </Nav>
                </Container>
            </Navbar>

            <Modal show={roleShow} onHide={handleRoleClose}>
                <ModalHeader>
                    <ModalTitle>
                        Add A Role
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl ref={roleName}></FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Role Description</FormLabel>
                            <FormControl ref={roleDes}></FormControl>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleRoleClose}>Discard</Button>
                    <Button variant="primary" onClick={() => {
                        // @ts-ignore
                        setRoleData([...roleData, { id: roleData[roleData.length - 1].id + 1, name: roleName.current.value, des: roleDes.current.value }])
                        handleRoleClose()
                    }}

                    >Add</Button>
                </ModalFooter>
            </Modal>

            <Modal show={batchShow} onHide={handleBatchClose}>
                <ModalHeader>
                    <ModalTitle>
                        Batch Editing
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <FormLabel>Edit as CSV (you can paste data to import or delete in batches)</FormLabel>
                            <FormControl as="textarea" ref={roleName} rows="12" value={csv} onChange={(e) => { setCSV(e.target.value) }}></FormControl>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleRoleClose}>Discard</Button>
                    <Button variant="primary" onClick={() => {
                        // console.log(csv2json(csv))
                        setRoleData(csv2json(csv))
                        handleBatchClose()
                    }}

                    >Add</Button>
                </ModalFooter>
            </Modal>

            <Container>
                <Row className="h-32">
                    <Col>
                        <div className="tw-p-3">
                            <div className="tw-p-1">Roles Mangement
                                <span className="tw-m-3">
                                    <Button size="sm" className="tw-ml-2 tw-mr-2" onClick={handleRoleShow}>Add</Button>
                                    <Button size="sm" className="tw-ml-2 tw-mr-2" onClick={batchEditRole}>Batch Edit</Button>
                                </span>
                            </div>

                            <DataGrid
                                editMode="row"
                                rows={roleData}
                                columns={role_columns}
                                pageSizeOptions={[10000]}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div className="tw-p-3">
                            <div className="tw-p-1">People  Mangement
                                <span className="tw-m-3">
                                    <Button size="sm" className="tw-ml-2 tw-mr-2" onClick={handlePeopleShow}>Add</Button>
                                    <Button size="sm" className="tw-ml-2 tw-mr-2" onClick={batchEditPeople}>Batch Edit</Button>
                                </span>
                            </div>

                            <DataGrid
                                editMode="row"
                                rows={peopleData}
                                columns={peopleColumns}
                                pageSizeOptions={[10000]}
                            />
                        </div>

                    </Col>
                </Row>


            </Container>
        </main>
    );
}
