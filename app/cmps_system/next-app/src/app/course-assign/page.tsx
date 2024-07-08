'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '@/app/components/NavBar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CourseAssign() {
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [position, setPosition] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch courses from the database
        const fetchCourses = async () => {
            const { data, error } = await supabase.from('course').select('*');
            if (error) {
                console.error('Error fetching courses:', error);
                setError(error.message);
            } else {
                setCourses(data);
            }
        };

        // Fetch instructors from the database
        const fetchInstructors = async () => {
            const { data, error } = await supabase.from('instructor').select('*');
            if (error) {
                console.error('Error fetching instructors:', error);
                setError(error.message);
            } else {
                setInstructors(data);
            }
        };

        fetchCourses();
        fetchInstructors();
    }, []);

    const handleSave = async () => {
        // Save the course assignment to the database
        const { data, error } = await supabase
            .from('course_assign')
            .insert([{
                course_id: selectedCourse,
                instructor_id: selectedInstructor,
                position: position,
                start_date: startDate,
                end_date: endDate
            }]);

        if (error) {
            console.error('Error saving assignment:', error);
            setError(error.message);
        } else {
            alert('Assignment saved successfully');
            setSelectedCourse('');
            setSelectedInstructor('');
            setPosition('');
            setStartDate('');
            setEndDate('');
        }
    };

    const handleCancel = () => {
        // Discard the selections
        setSelectedCourse('');
        setSelectedInstructor('');
        setPosition('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <main>
            <Navbar />
            <Container>
                <h1>Course Assignments</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Form>
                    <Form.Group controlId="courseSelect">
                        <Form.Label>Select Course</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                                <option key={course.course_id} value={course.course_id}>
                                    {course.course_title}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="instructorSelect" className="mt-3">
                        <Form.Label>Select Instructor</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedInstructor}
                            onChange={(e) => setSelectedInstructor(e.target.value)}
                        >
                            <option value="">Select an instructor</option>
                            {instructors.map((instructor) => (
                                <option key={instructor.instructor_id} value={instructor.instructor_id}>
                                    {instructor.first_name} {instructor.last_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="positionSelect" className="mt-3">
                        <Form.Label>Select Position</Form.Label>
                        <Form.Control
                            as="select"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        >
                            <option value="">Select a position</option>
                            <option value="Instructor">Instructor</option>
                            <option value="TA">TA</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="startDate" className="mt-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="endDate" className="mt-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" className="mt-3" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="secondary" className="mt-3 ml-2" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Form>
            </Container>
        </main>
    );
}
