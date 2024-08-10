'use client'
import Link from 'next/link';
import Navbar from '@/app/components/NavBar';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { act, useEffect, useRef, useState } from 'react';
import getUserType from '../components/getUserType';
import { Form, Tab, Tabs } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import supabase from "@/app/components/supabaseClient";
import { Modal, Button } from 'react-bootstrap';

const Instructor = () => {

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'course', headerName: 'Course' },
        { field: 'reviewer', headerName: 'Reviewer' },
        { field: 'reviewee', headerName: 'Reviewee' },
        { field: 'activate', headerName: 'Activate' },
        { field: 'review', headerName: 'Review', width: 300 },
        { field: 'score', headerName: 'Score' },
        {
            field: '', headerName: 'Write Review', renderCell: (params) => {
                return <Button variant="primary" key={params.row.id} onClick={async () => {
                    const review = prompt("Please Write Your Review")
                    const score = prompt("Please Enter Your Score")
                    const res = await supabase.from("ta_review").update({
                        review: review,
                        score: score
                    }).eq("id", params.row.id)
                    if (res.error) {
                        console.error(res.error);
                        alert("Failed to write review, " + res.error.message);
                    } else {
                        // Refresh the page to reflect the updated review
                        window.location.reload();
                    }
                }}>Write Review</Button>
            }, width: 150
        },
    ];

    const [rows, setRows] = useState([])
    useEffect(() => {
        (
            // this email selection is only for viewing purpose, RLS is needed for security purpose
            async ()=>{ supabase.from('v_ta_review').select().eq("email", (await supabase.auth.getUser()).data.user.email).then((res) => {
                if (res.error) {
                    console.error(res.error);
                    alert("Failed to fetch reviews, " + res.error.message);
                    return;
                }
                console.log(res.data)
                setRows(res.data)
            })}
        )()
    }, [])
    return <>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
            }}
            pageSizeOptions={[5, 10]}
        />
    </>
}


const ReviewModal = ({ show, onHide }) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedReviewee, setSelectedReviewee] = useState('');
    const [selectedReviewer, setSelectedReviewer] = useState('');

    const [courses, setCourses] = useState([]);
    const [reviewees, setReviewees] = useState([]);
    const [reviewers, setReviewers] = useState([]);

    useEffect(() => {
        const func = async () => {
            setCourses((await supabase.from('v_courses_with_instructors').select('*')).data);

        }
        func();
    }, [])
    const handleSubmit = async () => {
        // Handle the submission logic here
        console.log('Submitted:', { selectedCourse, selectedReviewee, selectedReviewer });
        const res = await supabase.from('ta_review').insert({
            course_session: selectedCourse,
            reviewee: selectedReviewee,
            reviewer: selectedReviewer,
            activate: true
        });
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Request Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Course</Form.Label>
                        <Form.Select
                            value={selectedCourse}
                            onChange={async (e) => {
                                 setSelectedCourse(e.target.value) 
                                const insts = (await supabase.from('v_course_info_assignees').select('*').eq('course_id', e.target.value)).data;
                                setReviewees(insts.filter(inst => inst.position === 'TA')); 
                                setReviewers(insts.filter(inst => inst.position === 'Instructor')); 
                            }}
                        >
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.full_course_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Reviewee</Form.Label>
                        <Form.Select
                            value={selectedReviewee}
                            onChange={(e) => setSelectedReviewee(e.target.value)}
                        >
                            <option value="">Select a reviewee</option>
                            {reviewees.map((reviewee) => (
                                <option key={reviewee.instructor_id} value={reviewee.instructor_id}>
                                    {reviewee.instructor_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Reviewer</Form.Label>
                        <Form.Select
                            value={selectedReviewer}
                            onChange={(e) => setSelectedReviewer(e.target.value)}
                        >
                            <option value="">Select a reviewer</option>
                            {reviewers.map((reviewer) => (
                                <option key={reviewer.instructor_id} value={reviewer.instructor_id}>
                                    {reviewer.instructor_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Discard
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Okay
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default function Tools() {
    /**
     * This page is the review for TA. If the user is an insturctor, they can see their TA and give them review if available. If the user is head, they can 
     * request a review from instructor for their TA and see their reviews. This page is different than other tables so it is not using the CMPS_Table component.
    */

    const [requestReview, setRequestReview] = useState(false);
    const [userType, setUserType] = useState('instructor');
    useEffect(() => {
        getUserType().then((res) => {
            setUserType(res);
        });
    }, []);
    return (
        <main>
            <Navbar />
            <div className="tw-p-10">
                {userType == "instructor" || <><Button onClick={() => setRequestReview(true)}>Request Reviews</Button><br /></>}
                <ReviewModal
                    show={requestReview}
                    onHide={() => setRequestReview(false)}
                />
                <Instructor />

                {/* <Tabs
                    defaultActiveKey="inst"
                    id="uncontrolled-tab-example"

                >
                    <Tab eventKey="inst" title="Instructor View">
                        <Instructor />
                    </Tab>
                    {userType == "instructor" || <Tab eventKey="head" title="Head View">
                        <Head />
                    </Tab>}
                </Tabs> */}
            </div>
        </main>
    );
}
