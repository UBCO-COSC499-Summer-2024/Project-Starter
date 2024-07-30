'use client';

import React, { useState } from 'react';
import NavBar from '@/app/components/NavBar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { createClient } from '@supabase/supabase-js';
import 'bootstrap/dist/css/bootstrap.min.css';

import supabase from "@/app/components/supabaseClient";
const CourseForm = () => {
    const [formData, setFormData] = useState({
        academic_year: null,
        session: null,
        term: null,
        subject_code: null,
        course_num: null,
        section_num: null,
        course_title: null,
        mode_of_delivery: null,
        req_in_person_attendance: null,
        building: null,
        room_num: null,
        section_comments: null,
        activity: null,
        days: null,
        start_time: null,
        end_time: null,
        num_students: null,
        num_tas: null,
        credits: null,
        year_level: null
    });

    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [newCourseId, setNewCourseId] = useState(null);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Insert evaluation entry into database
        const { data, error } = await supabase
            .from('course')
            .insert([formData])
            .select();

        // Display modal message based on success or failure
        if (error) {
            setModalTitle('Error');
            setModalMessage(`Failed to create course: ${error.message}`);
            setIsSuccess(false);
        } else {
            setModalTitle('Success');
            setModalMessage('Course created successfully.');
            setIsSuccess(true);
            setNewCourseId(data[0].course_id);
        }

        setModalShow(true);
    };

    const handleModalClose = () => {
        setModalShow(false);
        if (isSuccess) {
            window.location.href = '/courses';
        }
    };

    return (
        <>
            <main>
                <NavBar />
                <div className="container">
                    <form className="course-form" onSubmit={handleSubmit}>
                        <h1>Add New Course</h1>

                        <div className="form-group">
                            <label htmlFor="subject_code">Subject Code:</label>
                            <select id="subject_code" name="subject_code" onChange={handleChange} required>
                                <option value="">Select Subject Code</option>
                                <option value="COSC">COSC</option>
                                <option value="MATH">MATH</option>
                                <option value="PHYS">PHYS</option>
                                <option value="STAT">STAT</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="course_num">Course Number:</label>
                            <input type="number" id="course_num" name="course_num" placeholder="101" onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="course_title">Course Title</label>
                            <input type="text" id="course_title" name="course_title" onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="section_num">Section Number:</label>
                            <input type="number" id="section_num" name="section_num" placeholder="001" onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="academic_year">Academic Year:</label>
                            <input type="number" id="academic_year" name="academic_year" placeholder={new Date().getFullYear().toString()} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="session">Session:</label>
                            <div className="radio-group">
                                <input type="radio" id="winter" name="session" value="Winter" onChange={handleChange} required />
                                <label htmlFor="winter">Winter</label>
                            </div>
                            <div className="radio-group">
                                <input type="radio" id="summer" name="session" value="Summer" onChange={handleChange} required />
                                <label htmlFor="summer">Summer</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="term">Term:</label>
                            <div className="radio-group">
                                <input type="radio" id="1" name="term" value="Term 1" onChange={handleChange} required />
                                <label htmlFor="1">1</label>
                            </div>
                            <div className="radio-group">
                                <input type="radio" id="2" name="term" value="Term 2" onChange={handleChange} required />
                                <label htmlFor="2">2</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="mode_of_delivery">Mode of Delivery:</label>
                            <select id="mode_of_delivery" name="mode_of_delivery" onChange={handleChange}>
                                <option value="">Select Mode of Delivery</option>
                                <option value="In-Person">In Person</option>
                                <option value="Online">Online</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Hybrid">Multi-access</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="req_in_person_attendance">Requires In Person Attendance:</label>
                            <input type="checkbox" id="req_in_person_attendance" name="req_in_person_attendance" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="building">Building:</label>
                            <input type="text" id="building" name="building" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="room_num">Room:</label>
                            <input type="text" id="room_num" name="room_num" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="section_comments">Section Comments:</label>
                            <textarea id="section_comments" name="section_comments" onChange={handleChange}></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="activity">Activity:</label>
                            <select id="activity" name="activity" onChange={handleChange}>
                                <option value="">Select Activity</option>
                                <option value="Lecture">Lecture</option>
                                <option value="Lab">Lab</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="days">Days:</label>
                            <input type="text" id="days" name="days" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="start_time">Start Time:</label>
                            <input type="time" id="start_time" name="start_time" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_time">End Time:</label>
                            <input type="time" id="end_time" name="end_time" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="num_students">Number of Students:</label>
                            <input type="number" id="num_students" name="num_students" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="num_tas">Number of TAs:</label>
                            <input type="number" id="num_tas" name="num_tas" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="credits">Credits:</label>
                            <input type="number" id="credits" name="credits" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="year_level">Year Level:</label>
                            <input type="number" id="year_level" name="year_level" onChange={handleChange} />
                        </div>
                        <div className="buttons">
                            <button className="back-button" type="button" onClick={() => window.location.href = '/courses'}>Back</button>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                    <style jsx>{`
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .course-form {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }
                    .form-group {
                        display: flex;
                        flex-direction: column;
                    }
                    .form-group label {
                        margin-bottom: 8px;
                        font-weight: bold;
                    }
                    .form-group input,
                    .form-group textarea,
                    .form-group select {
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 16px;
                    }
                    .form-group textarea {
                        resize: vertical;
                        height: 100px;
                    }
                    .buttons {
                        display: flex;
                        justify-content: space-between;
                        gap: 10px;
                    }
                    button {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 16px;
                        cursor: pointer;
                    }
                    button[type="submit"] {
                        background-color: #0070f3;
                        color: white;
                    }
                    .back-button {
                        background-color: #ccc;
                    }
                    .radio-group {
                        display: flex;
                        gap: 5px;
                    }
                    .radio-group input[type="radio"] {
                        margin-right: 5px;
                    }
                `}</style>
                </div>
                <Modal show={modalShow} onHide={handleModalClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer>
                        {isSuccess && (
                            <>
                                <Button variant="secondary" onClick={() => window.location.href = '/courses'}>
                                    Return to courses
                                </Button>
                                <Button variant="primary" onClick={() => window.location.href = `/courses/course_info?id=${newCourseId}`}>
                                    Go to course
                                </Button>
                            </>
                        )}
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </>
    );
};

export default CourseForm;
