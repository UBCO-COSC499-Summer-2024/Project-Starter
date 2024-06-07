'use client'
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const parseData = function (x: Array[]) {
    // half gpt
    return {
        labels: x.ind.map(x => ("Jan")),
        datasets: [{
            label: 'Personal Monthly Working Hours',
            data: x.ind,
            backgroundColor: [
                'rgba(58, 190, 249, 0.2)',
            ],
            borderColor: [
                'rgb(58, 190, 249)',
            ],
            borderWidth: 1
        }, {
            label: 'Average Monthly Working Hours',
            data: x.avg,
            backgroundColor: [
                'rgba(200, 130, 249, 0.2)',
            ],
            borderColor: [
                'rgb(200, 130, 249)',
            ],
            borderWidth: 1
        }]
    }
}

export default function Home() {

    const working_hour = {
        "2023S": { "ind": Array.from(Array(8).keys()).map(x => (Math.round(Math.random() * 12))), "avg": Array.from(Array(8).keys()).map(x => (Math.round(Math.random() * 12))) },
        "2024W": { "ind": Array.from(Array(8).keys()).map(x => (Math.round(Math.random() * 12))), "avg": Array.from(Array(8).keys()).map(x => (Math.round(Math.random() * 12))) },
        "2024S": { "ind": Array.from(Array(8).keys()).map(x => (Math.round(Math.random() * 12))), "avg": Array.from(Array(8).keys()).map(x => (Math.round(Math.random() * 12))) },
    }

    const serviceRoles = [
        {
            name: "Grad Advisor",
            hour: 30,
        },
        {
            name: "Grad Advisor",
            hour: 35,
        }
    ]
    const assignments =
        [
            {
                "name": "COSC-102",
                "time": "MON, WED, FRI - 12:00pm-1:00pm",
                "student_count": 102,
                "term": "1",
                "location": "Basement"
            },
            {
                "name": "COSC-449",
                "time": "TUE, THU- 12:00pm-6:00pm",
                "student_count": 1,
                "term": "1-2",
                "location": "Bathroom"
            },
            {
                "name": "COSC-449",
                "time": "TUE, THU- 8:00am-10:00am",
                "student_count": 1,
                "term": "1-2",
                "location": "SCI102"
            }
        ]

    const rating = {
        "2023S": [
            {
                "name": "COSC101",
                "term": "1",
                "student_count": 100,
                "rating": "88%"
            },
            {
                "name": "COSC121",
                "term": "2",
                "student_count": 55,
                "rating": "50%"
            },
        ],
        "2024W": [
            {
                "name": "COSC101",
                "term": "1",
                "student_count": 120,
                "rating": "98%"
            },
            {
                "name": "COSC121",
                "term": "2",
                "student_count": 65,
                "rating": "30%"
            },
        ]
    }

    const [term, setTerm] = useState(Object.keys(working_hour)[Object.keys(working_hour).length - 1]);
    const [ratingTerm, setRatingTerm] = useState(Object.keys(rating)[Object.keys(rating).length - 1]);
    console.log(working_hour["2023S"])
    return (
        <main>
            <Navbar style={{ backgroundColor: "#002145" }} expand="lg">
                <Container>
                    <NavbarBrand><b className="tw-text-white">Instructor Dashboard</b></NavbarBrand>
                    <Nav className="me-auto">
                        <NavLink href="/instructor_dashboard/individual"><span className="tw-text-white tw-font-bold">Individual</span></NavLink>
                        <NavLink href="/instructor_dashboard/department"><span className="tw-text-white">Department</span></NavLink>
                    </Nav>
                    <Nav justify-content-end>
                        <NavLink><span className="tw-text-white">Logout</span></NavLink>
                    </Nav>
                </Container>
            </Navbar>

            <Container>
                <Row className="tw-pt-3">
                    <Col xs={8}>
                        <Card>
                            <b className="tw-mt-2 tw-ml-2 tw-text-lg">Course Assignments</b>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Term</th>
                                        <th>Time</th>
                                        <th>Student Counts</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        assignments.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.name}</td>
                                                <td>{x.term}</td>
                                                <td>{x.time}</td>
                                                <td>{x.student_count}</td>
                                                <td>{x.location}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col xs={4}>
                        <Card>
                            <b className="tw-mt-2 tw-ml-2 tw-text-lg">Service Roles Hours</b>

                            <Table>
                                <thead>
                                    <tr>
                                        <th>Service Role</th>
                                        <th>Hours Worked</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        serviceRoles.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.name}</td>
                                                <td>{x.hour}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col className="pt-3">
                        <Card className="tw-mb-3">
                        <b className="tw-mt-2 tw-ml-2 tw-text-lg">Historical Working Hours</b>

                            <Dropdown className="tw-ml-2">
                                <DropdownToggle>
                                    {term}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {Object.keys(working_hour).map((x, index) => (
                                        <DropdownItem key={index} onClick={() => {
                                            setTerm(x)
                                        }}>
                                            {x}
                                        </DropdownItem>))}
                                </DropdownMenu>
                            </Dropdown>
                            {/* gpt code */}
                            <div className="tw-h-62">
                                <Bar className="tw-p-2 tw-h-max"
                                    data={parseData(working_hour[term])}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        },

                                    }}
                                />
                            </div>
                        </Card>
                    </Col>
                    <Col className="tw-pt-3">
                        <Card>
                            <b className="tw-mt-2 tw-ml-2 tw-text-lg">SEI Results</b>
                            <Dropdown className="tw-ml-2">
                                <DropdownToggle>
                                    {ratingTerm}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {Object.keys(rating).map((x, index) => (
                                        <DropdownItem key={index} onClick={() => {
                                            setRatingTerm(x)
                                        }}>
                                            {x}
                                        </DropdownItem>))}
                                </DropdownMenu>
                            </Dropdown>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Term</th>
                                        <th>Student Counts</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rating[ratingTerm].map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.name}</td>
                                                <td>{x.term}</td>
                                                <td>{x.student_count}</td>
                                                <td>{x.rating}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </main>
    );
}
