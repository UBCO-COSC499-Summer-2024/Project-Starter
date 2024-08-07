'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, ProgressBar, Button } from 'react-bootstrap';
import supabase from "@/app/components/supabaseClient";
import Link from 'next/link';
import Navbar from '@/app/components/NavBar';
import Alert from 'react-bootstrap/Alert';
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

const academicYearMonthNames = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

const parseData = (x) => ({
    labels: x.map(entry => academicYearMonthNames[(entry.month - 5 + 12) % 12]),
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

const HourCard = ({ displayedMonth, displayedYear }) => {
    const [personalHour, setPersonalHour] = useState(0);
    const [departmentHour, setDepartmentHour] = useState(0);
    const [personalExpected, setPersonalExpected] = useState(0);
    const [departmentExpected, setDepartmentExpected] = useState(0);

    useEffect(() => {
        (async () => {
            const userRes = await supabase.auth.getUser();
            const instructor_hours = await supabase
                .from("v_dashboard_instructor_service_hours")
                .select("*")
                .eq("email", userRes.data.user.email)
                .eq("year", displayedYear)
                .eq("month", displayedMonth);

            if (instructor_hours.data && instructor_hours.data.length > 0) {
                setPersonalHour(instructor_hours.data[0].hours);
                setPersonalExpected(instructor_hours.data[0].monthly_benchmark);
            } else {
                setPersonalHour(0);
                setPersonalExpected(0);
            }

            const department_hours = await supabase.from("v_dashboard_department_service_hours")
                .select("*")
                .eq("year", displayedYear)
                .eq("month", displayedMonth);

            if (department_hours.data && department_hours.data.length > 0) {
                setDepartmentHour(department_hours.data[0].hours);
                setDepartmentExpected(department_hours.data[0].monthly_benchmark);
            } else {
                setDepartmentHour(0);
                setDepartmentExpected(0);
            }
        })();
    }, [displayedMonth, displayedYear]);

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

const getYearSessionTerm = (date) => {
    const month = date.getMonth() + 1; // getMonth() returns 0-based month, so we add 1
    const year = date.getFullYear();
    let session = "Winter";
    let term = "Term 1";
    let academicYear = year;

    if (month >= 5 && month <= 8) {
        session = "Summer";
        if (month >= 7) {
            term = "Term 2";
        }
        academicYear = year; // Academic year starts in May
    } else {
        if (month >= 1 && month <= 4) {
            term = "Term 2";
            academicYear = year - 1; // Still part of the previous academic year
        } else {
            academicYear = year - 1; // Still part of the previous academic year
        }
    }

    return [academicYear, session, term];
}

const UpcomingEventsCard = ({ displayedMonth, displayedYear }) => {
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const today = new Date();
            const fourteenDaysAhead = new Date();
            fourteenDaysAhead.setDate(today.getDate() + 14);

            const start_date = displayedMonth === today.getMonth() + 1 && displayedYear === today.getFullYear()
                ? today.toISOString()
                : new Date(displayedYear, displayedMonth - 1, 1).toISOString();

            const end_date = displayedMonth === today.getMonth() + 1 && displayedYear === today.getFullYear()
                ? fourteenDaysAhead.toISOString()
                : new Date(displayedYear, displayedMonth, 0).toISOString();

            const { data, error } = await supabase
                .from('v_dashboard_events')
                .select('*')
                .gte('event_datetime', start_date)
                .lte('event_datetime', end_date)
                .order('event_datetime', { ascending: true });

            if (error) {
                console.error('Error fetching upcoming events:', error);
                setEventsError(error.message);
            } else {
                setEvents(data);
            }
            setEventsLoading(false);
        };

        fetchEvents();
    }, [displayedMonth, displayedYear]);

    const getTableHeight = () => {
        const rowHeight = 50; // approximate height of each row
        const maxRows = 5; // maximum number of rows to show without scrolling
        const headerHeight = 56; // height of the table header
        const extraSpace = 32; // padding/margin space
        const rowsToShow = events.length > maxRows ? maxRows : events.length;
        return headerHeight + extraSpace + (rowsToShow * rowHeight);
    };

    return (
        <Card className="tw-mb-3">
            <b className="tw-mt-2 tw-ml-2 tw-text-lg">{displayedYear * 12 + displayedMonth < new Date().getFullYear() * 12 + new Date().getMonth() + 1 ? "Past Events" : "Upcoming Events"}</b>
            <div className="tw-m-3 tw-overflow-y-auto" style={{ maxHeight: getTableHeight() }}>
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
                            <tr><td colSpan="3">Loading...</td></tr>
                        ) : eventsError ? (
                            <tr><td colSpan="3">Error fetching events: {eventsError}</td></tr>
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
                            <tr><td colSpan="3">No upcoming events found</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Card>
    );
};

const RecentEvaluationsCard = ({ displayedMonth, displayedYear }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvaluations = async () => {
            const userRes = await supabase.auth.getUser();
            const today = new Date();
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(today.getDate() - 14);

            const start_date = displayedMonth === today.getMonth() + 1 && displayedYear === today.getFullYear()
                ? fourteenDaysAgo.toISOString()
                : new Date(displayedYear, displayedMonth - 1, 1).toISOString();

            const end_date = displayedMonth === today.getMonth() + 1 && displayedYear === today.getFullYear()
                ? new Date(displayedYear, displayedMonth, 14).toISOString()
                : new Date(displayedYear, displayedMonth, 0).toISOString();

            const { data, error } = await supabase
                .from('v_evaluations_page')
                .select('*')
                .eq('instructor_email', userRes.data.user.email)
                .gte('evaluation_date', start_date)
                .lte('evaluation_date', end_date);

            if (error) {
                console.error('Error fetching evaluations:', error);
                setError(error.message);
            } else {
                setEvaluations(data);
            }
            setLoading(false);
        };

        fetchEvaluations();
    }, [displayedMonth, displayedYear]);

    return (
        <Card className="tw-mb-3">
            <b className="tw-mt-2 tw-ml-2 tw-text-lg">{displayedYear * 12 + displayedMonth < new Date().getFullYear() * 12 + new Date().getMonth() + 1 ? "Past Evaluations" : "Recent Evaluations"}</b>
            <Table>
                <thead>
                    <tr>
                        <th>Evaluation Type</th>
                        <th>Course</th>
                        <th>Service Role</th>
                        <th>Question Num</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="7">Loading...</td></tr>
                    ) : error ? (
                        <tr><td colSpan="7">Error fetching evaluations: {error}</td></tr>
                    ) : evaluations.length > 0 ? (
                        evaluations.map((x, index) => (
                            <tr key={index}>
                                <td>{x.evaluation_type}</td>
                                <td>{x.course}</td>
                                <td>{x.service_role}</td>
                                <td>{x.question_num}</td>
                                <td>{x.question}</td>
                                <td>{x.answer}</td>
                                <td>{new Date(x.evaluation_date).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7">No evaluations found</td></tr>
                    )}
                </tbody>
            </Table>
        </Card>
    );
};

export default function Home() {

    const [displayedMonth, setDisplayedMonth] = useState(new Date().getMonth() + 1);
    const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());

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
    const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
        const checkActiveTAReview = async () => {
            const userRes = await supabase.auth.getUser();
            if (userRes.data.user && userRes.data.user.email) {
                // Fetch the instructor ID based on the email
                const { data: instructorData, error: instructorError } = await supabase
                    .from('instructor')
                    .select('instructor_id')
                    .eq('email', userRes.data.user.email)
                    .single();

                if (instructorError) {
                    console.error('Error fetching instructor data:', instructorError);
                    return;
                }

                // Query the ta_review table to check for active reviews
                const { data: reviewData, error: reviewError } = await supabase
                    .from('ta_review')
                    .select('activate')
                    .eq('reviewer', instructorData.instructor_id)
                    .single();

                if (reviewError) {
                    console.error('Error checking active reviews:', reviewError);
                    return;
                }

                if (reviewData.activate) {
                    setShowAlert(true);
                }
            }
        };

        checkActiveTAReview();
    }, []);
    useEffect(() => {
        const fetchAssignments = async () => {
            const [academicYear, session, term] = getYearSessionTerm(new Date(displayedYear, displayedMonth - 1));
            const userRes = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('v_dashboard_courses')
                .select('*')
                .eq('instructor_email', userRes.data.user.email)
                .eq('academic_year', academicYear)
                .eq('session', session)
                .or(`term.eq.${term},term.eq.Term 1-2`);
            if (error) {
                console.error('Error fetching teaching assignments:', error);
                setAssignmentsError(error.message);
            } else {
                setAssignments(data);
            }
            setAssignmentsLoading(false);
        };

        fetchAssignments();
    }, [displayedMonth, displayedYear]);

    useEffect(() => {
        const fetchServiceRoles = async () => {
            const userRes = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('v_timetracking')
                .select('*')
                .eq('year', displayedYear)
                .eq('month', displayedMonth)
                .eq('instructor_email', userRes.data.user.email);

            if (error) {
                console.error('Error fetching service roles:', error.message);
                setServiceError(error.message);
            } else {
                setServiceRoles(data);
            }
            setServiceLoading(false);
        };

        fetchServiceRoles();
    }, [displayedMonth, displayedYear]);

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
            }
            setLoading(false);
        };

        fetchWorkingHours();
    }, []);

    const getFilteredWorkingHours = () => {
        const academicYear = new Date().getFullYear();
        const currentMonth = displayedMonth >= 5 ? displayedMonth : displayedMonth + 12; // Adjust for months January to April

        return workingHours.filter(entry => {
            const entryMonth = entry.month >= 5 ? entry.month : entry.month + 12;
            return entry.year === academicYear && entryMonth <= currentMonth;
        });
    };

    const handlePreviousMonth = () => {
        if (displayedMonth === 1) {
            setDisplayedMonth(12);
            setDisplayedYear(displayedYear - 1);
        } else {
            setDisplayedMonth(displayedMonth - 1);
        };
    }

    const handleNextMonth = () => {
        if (displayedMonth === 12) {
            setDisplayedMonth(1);
            setDisplayedYear(displayedYear + 1);
        } else {
            setDisplayedMonth(displayedMonth + 1);
        };
    }

    return (
        <main>
            <Navbar />
            <Container>
                <Row className="tw-pt-3">

                    <Col xs={12} className="tw-text-center">
                        <h2 className="tw-mb-4 d-flex justify-content-center align-items-center">
                            <Button variant="link" onClick={handlePreviousMonth}>&lt;</Button>
                            <span className="mx-3" style={{ minWidth: '8em', textAlign: 'center' }}>
                                {new Date(displayedYear, displayedMonth - 1).toLocaleString('default', { month: 'long' })} {displayedYear}
                            </span>
                            <Button variant="link" onClick={handleNextMonth}>&gt;</Button>
                        </h2>

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
                                        <tr><td colSpan="6">Loading...</td></tr>
                                    ) : assignmentsError ? (
                                        <tr><td colSpan="6">Error fetching assignments: {assignmentsError}</td></tr>
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
                                        <tr><td colSpan="6">No assignments found</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card>
                        <Card className="tw-mb-3 tw-mt-3">
                            <b className="tw-mt-2 tw-ml-2 tw-text-lg">Year-to-date Service Hours</b>
                            <div className="tw-h-48">
                                <Bar className="tw-p-2 tw-h-max"
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
                        <HourCard displayedMonth={displayedMonth} displayedYear={displayedYear} />
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
                                        <tr><td colSpan="2">Loading...</td></tr>
                                    ) : serviceError ? (
                                        <tr><td colSpan="2">Error fetching service roles: {serviceError}</td></tr>
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
                                        <tr><td colSpan="2">No service roles found</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col className="tw-pt-3">
                        <UpcomingEventsCard displayedMonth={displayedMonth} displayedYear={displayedYear} />
                    </Col>
                </Row>
                <Row>
                    <Col className="tw-pt-3">
                        <RecentEvaluationsCard displayedMonth={displayedMonth} displayedYear={displayedYear} />
                    </Col>
                </Row>
            </Container>
        </main>
    );
}
