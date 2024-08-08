'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ProgressBar } from 'react-bootstrap';
import supabase from "@/app/components/supabaseClient";
import Link from 'next/link';
import Navbar from '@/app/components/NavBar';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const monthNames = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

const parseData = (x) => ({
    labels: x.map(entry => monthNames[(entry.month - 5 + 12) % 12]),
    datasets: [{
        label: 'Hours',
        data: x.map(entry => entry.hours),
        backgroundColor: 'rgba(58, 190, 249, 0.2)',
        borderColor: 'rgb(58, 190, 249)',
        borderWidth: 1
    },
    {
        label: 'Monthly Target Hours',
        data: x.map(entry => entry.monthly_benchmark),
        type: 'line',
        borderColor: 'red',
        borderWidth: 2,
        fill: false,
        pointRadius: 0, // hide the points
        spanGaps: true, // ensure the line spans the entire chart
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
                .eq("email", userRes.data.user.email);

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
                <b className="tw-mt-2 tw-ml-2 tw-text-lg">Personal Service Hours</b>
                <h1>{personalHour}/{personalExpected}</h1>
                <p className="tw-ml-5">(worked/expected)</p>
                <ProgressBar className="tw-m-3" now={personalExpected === 0 ? 0 : personalHour / personalExpected * 100} />
            </div>

            <div style={{ color: departmentExpected === 0 || departmentHour / departmentExpected > 0.5 ? "green" : "orange" }}>
                <b className="tw-mt-2 tw-ml-2 tw-text-lg">Department Service Hours</b>
                <h1>{departmentHour}/{departmentExpected}</h1>
                <p className="tw-ml-5">(worked/expected)</p>
                <ProgressBar className="tw-m-3" now={departmentExpected === 0 ? 0 : departmentHour / departmentExpected * 100} />
            </div>
        </Card>
    );
};

const UpcomingEventsCard = () => {
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('v_dashboard_upcoming_events')
                .select('*');

            if (error) {
                console.error('Error fetching upcoming events:', error);
                setEventsError(error.message);
            } else {
                setEvents(data);
            }
            setEventsLoading(false);
        };

        fetchEvents();
    }, []);

    return (
        <Card className="tw-mb-3">
            <b className="tw-mt-2 tw-ml-2 tw-text-lg">Upcoming Events</b>
            <div className="tw-m-3 tw-h-48 tw-overflow-y-auto">
                <Table>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Description</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventsLoading ? (
                            <tr><td colSpan={3}>Loading...</td></tr>
                        ) : eventsError ? (
                            <tr><td colSpan={3}>Error fetching events: {eventsError}</td></tr>
                        ) : events.length > 0 ? (
                            events.map((event, index) => (
                                <tr key={index}>
                                    <td>{new Date(event.event_datetime).toLocaleString()}</td>
                                    <td>
                                        <Link href={`/time_tracking/events/event_info?id=${event.event_id}`}>
                                            {event.description}
                                        </Link>
                                    </td>
                                    <td>{event.location}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={3}>No upcoming events found</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Card>
    );
};

export default function Home() {
    const [year, setTerm] = useState("");
    const [availableYears, setAvailableYears] = useState([]);
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
            const userRes = await supabase.auth.getUser();
            const { data, error } = await supabase.from('v_dashboard_current_courses').select('*').eq('instructor_email', userRes.data.user.email);
            if (error) {
                console.error('Error fetching teaching assignments:', error);
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
            const userRes = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('v_service_hours_entry')
                .select('*').eq('instructor_email', userRes.data.user.email);

            if (error) {
                console.error('Error fetching service hours:', error);
                setError(error.message);
            } else {
                setWorkingHours(data);

                const years = Array.from(new Set(data.map(entry => {
                    if (entry.month >= 5) {
                        return entry.year;
                    } else {
                        return entry.year - 1;
                    }
                })));

                setAvailableYears(years);
                if (years.length > 0) {
                    setTerm(years[years.length - 1].toString());
                } else {
                    setTerm("");
                }
            }
            setLoading(false);
        };

        fetchWorkingHours();
    }, []);

    const getCurrentMonthYear = () => {
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };

    const getFilteredWorkingHours = () => {
        const academicYear = parseInt(year);
        return workingHours.filter(entry => {
            if (entry.month >= 5) {
                return entry.year === academicYear;
            } else {
                return entry.year === academicYear + 1;
            }
        });
    };

    return (
        <main>
            <Navbar />
            <Container>
                <Row className="tw-pt-3">
                    <Col xs={12}>
                        <h2 className="tw-mb-4 tw-text-center">{getCurrentMonthYear()}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xs={8}>
                        <Card>
                            <b className="tw-mt-2 tw-ml-2 tw-text-lg">Course Assignments</b>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Section</th>
                                        <th>Days/Time</th>
                                        <th>Students</th>
                                        <th>Location</th>
                                        <th>Registration Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignmentsLoading ? (
                                        <tr><td colSpan={6}>Loading...</td></tr>
                                    ) : assignmentsError ? (
                                        <tr><td colSpan={6}>Error fetching assignments: {assignmentsError}</td></tr>
                                    ) : assignments.length > 0 ? (
                                        assignments.map((x, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Link href={`/courses/course_info?id=${x.course_id}`}>
                                                        {x.course_title}
                                                    </Link>
                                                </td>
                                                <td>{x.section_num}</td>
                                                <td>{x.days} - {x.start_time} to {x.end_time}</td>
                                                <td>{x.num_students}</td>
                                                <td>{x.location}</td>
                                                <td>{x.registration_status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={6}>No assignments found</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card>
                        <Card className="tw-mb-3 tw-mt-3">
                            <b className="tw-mt-2 tw-ml-2 tw-text-lg">Year-to-date Service Hours</b>
                            <Dropdown className="tw-ml-2">
                                <DropdownToggle>{year}</DropdownToggle>
                                <DropdownMenu>
                                    {availableYears.map((year, index) => (
                                        <DropdownItem key={index} onClick={() => setTerm(year.toString())}>
                                            {year}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            <div className="tw-h-48">
                                <Bar className="tw-p-2 tw-h-max"
                                    // @ts-ignore
                                    data={parseData(getFilteredWorkingHours())}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: { y: { beginAtZero: true } }
                                    }}
                                />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={4}>
                        <HourCard />
                        <Card>
                            <b className="tw-mt-2 tw-ml-2 tw-text-lg">Hours per Service Role</b>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Service Role</th>
                                        <th>Hours Worked</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceLoading ? (
                                        <tr><td colSpan={2}>Loading...</td></tr>
                                    ) : serviceError ? (
                                        <tr><td colSpan={2}>Error fetching service roles: {serviceError}</td></tr>
                                    ) : serviceRoles.length > 0 ? (
                                        serviceRoles.map((x, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Link href={`/service_roles/service_role_info?id=${x.service_role_id}`}>
                                                        {x.service_role}
                                                    </Link>
                                                </td>
                                                <td>{x.hours}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={2}>No service roles found</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
                <Row>
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
                <Row>
                    <Col className="tw-pt-3">
                        <UpcomingEventsCard />
                    </Col>
                </Row>
            </Container>
        </main>
    );
}

