'use client'
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from '@/app/components/NavBar';
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
import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const parseData = function (x) {
    return {
        labels: x.map(entry => entry.month),
        datasets: [{
            label: 'Personal Monthly Working Hours',
            data: x.map(entry => entry.hours),
            backgroundColor: [
                'rgba(58, 190, 249, 0.2)',
            ],
            borderColor: [
                'rgb(58, 190, 249)',
            ],
            borderWidth: 1
        }]
    }
}

export default function Home() {
    const [term, setTerm] = useState("2024");
    const [workingHours, setWorkingHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [assignmentsLoading, setAssignmentsLoading] = useState(true);
    const [assignmentsError, setAssignmentsError] = useState(null);
    const [serviceRoles, setServiceRoles] = useState([]);
    const [serviceLoading, setServiceLoading] = useState(true);
    const [serviceError, setServiceError] = useState(null);
    const [ratingTerm, setRatingTerm] = useState("2024");
    const [rating, setRating] = useState({
        "2023": [
            {
                name: "COSC101",
                term: "1",
                student_count: 100,
                rating: "88%"
            },
            {
                name: "COSC121",
                term: "2",
                student_count: 55,
                rating: "50%"
            },
        ],
        "2024": [
            {
                name: "COSC101",
                term: "1",
                student_count: 120,
                rating: "98%"
            },
            {
                name: "COSC121",
                term: "2",
                student_count: 65,
                rating: "30%"
            },
        ]
    });

    useEffect(() => {
        const fetchAssignments = async () => {
            const { data, error } = await supabase.from('course').select('*');
            if (error) {
                console.error('Error fetching assignments:', error);
                setAssignmentsError(error.message);
            } else {
                setAssignments(data);
            }
            setAssignmentsLoading(false);
        };

        fetchAssignments();
    }, []);

    useEffect(() => {
        const fetchServiceRoles = async () => {
            const { data: serviceRolesData, error: serviceRolesError } = await supabase.from('service_role').select('*');
            const { data: serviceHoursData, error: serviceHoursError } = await supabase.from('service_hours_entry').select('*');

            if (serviceRolesError || serviceHoursError) {
                console.error('Error fetching service roles:', serviceRolesError || serviceHoursError);
                setServiceError((serviceRolesError || serviceHoursError).message);
            } else {
                const joinedData = serviceHoursData.map(entry => {
                    const role = serviceRolesData.find(role => role.service_role_id === entry.service_role_id);
                    return {
                        ...entry,
                        roleName: role ? role.title : 'Unknown Role'
                    };
                });
                setServiceRoles(joinedData);
            }
            setServiceLoading(false);
        };

        fetchServiceRoles();
    }, []);

    useEffect(() => {
        const fetchWorkingHours = async () => {
            const { data, error } = await supabase
                .from('service_hours_entry')
                .select('*')
                .eq('year', term);

            if (error) {
                console.error('Error fetching working hours:', error);
                setError(error.message);
            } else {
                setWorkingHours(data);
            }
            setLoading(false);
        };

        fetchWorkingHours();
    }, [term]);

    return (
        <main>
            <Navbar />

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
                                    {assignmentsLoading ? (
                                        <tr><td colSpan="5">Loading...</td></tr>
                                    ) : assignmentsError ? (
                                        <tr><td colSpan="5">Error fetching assignments: {assignmentsError}</td></tr>
                                    ) : assignments.length > 0 ? (
                                        assignments.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.course_title}</td>
                                                <td>{x.term}</td>
                                                <td>{x.days} - {x.start_time} to {x.end_time}</td>
                                                <td>{x.num_students}</td>
                                                <td>{x.building} {x.room_num}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5">No assignments found</td></tr>
                                    )}
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
                                    {serviceLoading ? (
                                        <tr><td colSpan="2">Loading...</td></tr>
                                    ) : serviceError ? (
                                        <tr><td colSpan="2">Error fetching service roles: {serviceError}</td></tr>
                                    ) : serviceRoles.length > 0 ? (
                                        serviceRoles.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.roleName}</td>
                                                <td>{x.hours}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="2">No service roles found</td></tr>
                                    )}
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
                                    {[2023, 2024].map((year, index) => (
                                        <DropdownItem key={index} onClick={() => {
                                            setTerm(year)
                                        }}>
                                            {year}
                                        </DropdownItem>))}
                                </DropdownMenu>
                            </Dropdown>
                            <div className="tw-h-62">
                                <Bar className="tw-p-2 tw-h-max"
                                    data={parseData(workingHours)}
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
