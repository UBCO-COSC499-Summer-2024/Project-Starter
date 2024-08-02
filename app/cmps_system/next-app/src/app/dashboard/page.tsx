'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ProgressBar } from 'react-bootstrap';
import supabase from "@/app/components/supabaseClient";
import Navbar from '@/app/components/NavBar';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const parseData = (x) => ({
    labels: x.map(entry => entry.month),
    datasets: [{
        label: 'Personal Monthly Working Hours',
        data: x.map(entry => entry.hours),
        backgroundColor: 'rgba(58, 190, 249, 0.2)',
        borderColor: 'rgb(58, 190, 249)',
        borderWidth: 1
    }]
});

const HourCard = () => {
    const [personalHour, setPersonalHour] = useState(0);
    const [departmentHour, setDepartmentHour] = useState(0);
    const [personalExpected, setPersonalExpected] = useState(0);
    const [departmentExpected, setDepartmentExpected] = useState(0);

    useEffect(() => {
        (async () => {
            const userRes = await supabase.auth.getUser();
            const res = await supabase
                .from("v_dashboard_progress")
                .select("*")
                .eq("instructor_email", userRes.data.user.email);

            if (res.data && res.data.length > 0) {
                setPersonalHour(res.data[0].worked);
                setPersonalExpected(res.data[0].expected);
            } else {
                setPersonalHour(0);
                setPersonalExpected(0);
            }

            const res2 = await supabase.from("v_dashboard_progress").select("*");

            if (res2.data && res2.data.length > 0) {
                const departmentTotalWorked = res2.data.reduce((acc, cur) => acc + cur.worked, 0);
                const departmentTotalExpected = res2.data.reduce((acc, cur) => acc + cur.expected, 0);
                setDepartmentHour(departmentTotalWorked);
                setDepartmentExpected(departmentTotalExpected);
            } else {
                setDepartmentHour(0);
                setDepartmentExpected(0);
            }
        })();
    }, []);

    return (
        <Card className="tw-mb-3">
            <div style={{ color: personalExpected === 0 || personalHour / personalExpected > 0.5 ? "green" : "orange" }}>
                <b className="tw-mt-2 tw-ml-2 tw-text-lg">Personal service hours this month</b>
                <h1>{personalHour}/{personalExpected}</h1>
                <p className="tw-ml-5">(worked/expected)</p>
                <ProgressBar className="tw-m-3" now={personalExpected === 0 ? 0 : personalHour / personalExpected * 100} />
            </div>

            <div style={{ color: departmentExpected === 0 || departmentHour / departmentExpected > 0.5 ? "green" : "orange" }}>
                <b className="tw-mt-2 tw-ml-2 tw-text-lg">Department service hours this month</b>
                <h1>{departmentHour}/{departmentExpected}</h1>
                <p className="tw-ml-5">(worked/expected)</p>
                <ProgressBar className="tw-m-3" now={departmentExpected === 0 ? 0 : departmentHour / departmentExpected * 100} />
            </div>
        </Card>
    );
};

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
            { name: "COSC101", term: "1", student_count: 100, rating: "88%" },
            { name: "COSC121", term: "2", student_count: 55, rating: "50%" }
        ],
        "2024": [
            { name: "COSC101", term: "1", student_count: 120, rating: "98%" },
            { name: "COSC121", term: "2", student_count: 65, rating: "30%" }
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
            const userRes = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('v_timetracking')
                .select('*')
                .eq('year', new Date().getFullYear())
                .eq('month', new Date().getMonth() + 1)
                .eq('instructor_email', userRes.data.user.email);

            if (error) {
                console.error('Error fetching service roles:', error);
                setServiceError(error.message);
            } else {
                setServiceRoles(data);
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
                        <HourCard />
                        <Card>
                            <b className="tw-mt-2 tw-ml-2 tw-text-lg">Hours per service role this month</b>
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
                                                <td>{x.service_role}</td>
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
                                <DropdownToggle>{term}</DropdownToggle>
                                <DropdownMenu>
                                    {[2023, 2024].map((year, index) => (
                                        <DropdownItem key={index} onClick={() => setTerm(year)}>
                                            {year}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            <div className="tw-h-62">
                                <Bar className="tw-p-2 tw-h-max"
                                    data={parseData(workingHours)}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: { y: { beginAtZero: true } }
                                    }}
                                />
                            </div>
                        </Card>
                    </Col>
                    <Col className="tw-pt-3">
                        <Card>
                            <b className="tw-mt-2 tw-ml-2 tw-text-lg">SEI Results</b>
                            <Dropdown className="tw-ml-2">
                                <DropdownToggle>{ratingTerm}</DropdownToggle>
                                <DropdownMenu>
                                    {Object.keys(rating).map((x, index) => (
                                        <DropdownItem key={index} onClick={() => setRatingTerm(x)}>
                                            {x}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Term</th>
                                        <th>Students</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rating[ratingTerm].map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.term}</td>
                                            <td>{x.student_count}</td>
                                            <td>{x.rating}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </main>
    );
}
