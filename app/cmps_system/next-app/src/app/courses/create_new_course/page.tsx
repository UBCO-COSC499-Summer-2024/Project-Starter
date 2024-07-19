'use client'
import React from 'react';
import NavBar from '@/app/components/NavBar';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);

const CourseForm = () => {
    return (
        <main>
            <NavBar />
            <div className="container">
                <form className="course-form">
                    <h1>Add New Course</h1>
                    <div className="form-group">
                        <label htmlFor="subjectCode">Subject Code:</label>
                        <input type="text" id="subjectCode" name="subjectCode" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="courseNumber">Course Number:</label>
                        <input type="text" id="courseNumber" name="courseNumber" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sectionNumber">Section Number:</label>
                        <input type="text" id="sectionNumber" name="sectionNumber" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="academicYear">Academic Year:</label>
                        <input type="text" id="academicYear" name="academicYear" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="session">Session:</label>
                        <div className="radio-group">
                            <input type="radio" id="winter" name="session" value="Winter" required />
                            <label htmlFor="winter">Winter</label>
                        </div>
                        <div className="radio-group">
                            <input type="radio" id="summer" name="session" value="Summer" required />
                            <label htmlFor="summer">Summer</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="term">Term:</label>
                        <div className="radio-group">
                            <input type="radio" id="1" name="term" value="1" required />
                            <label htmlFor="1">1</label>
                        </div>
                        <div className="radio-group">
                            <input type="radio" id="2" name="term" value="2" required />
                            <label htmlFor="2">2</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="modeOfDelivery">Mode of Delivery:</label>
                        <select id="modeOfDelivery" name="modeOfDelivery">
                            <option value="">Select Mode of Delivery</option>
                            <option value="In Person">In Person</option>
                            <option value="Online">Online</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="requiresInPersonAttendance">Requires In Person Attendance:</label>
                        <input type="checkbox" id="requiresInPersonAttendance" name="requiresInPersonAttendance" />
                    </div>

                    {/* TODO: finish the list of buildings*/}
                    <div className="form-group">
                        <label htmlFor="building">Building:</label>
                        <select id="building" name="building">
                            <option value="">Select Building</option>
                            <option value="EME">EME</option>
                            <option value="FIP">FIP</option>
                            <option value="SCI">SCI</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="roomNumber">Room:</label>
                        <input type="text" id="roomNumber" name="roomNumber" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sectionComments">Section Comments:</label>
                        <textarea id="sectionComments" name="sectionComments"></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="activity">Activity:</label>
                        <select id="activity" name="activity">
                            <option value="">Select Activity</option>
                            <option value="Lecture">Lecture</option>
                            <option value="Lab">Lab</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="days">Days:</label>
                        <input type="text" id="days" name="days" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="startTime">Start Time:</label>
                        <input type="time" id="startTime" name="startTime" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endTime">End Time:</label>
                        <input type="time" id="endTime" name="endTime" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="numberOfStudents">Number of Students:</label>
                        <input type="number" id="numberOfStudents" name="numberOfStudents" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="numberOfTAs">Number of TAs:</label>
                        <input type="number" id="numberOfTAs" name="numberOfTAs" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="credits">Credits:</label>
                        <input type="number" id="credits" name="credits" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="yearLevel">Year Level:</label>
                        <input type="number" id="yearLevel" name="yearLevel" />
                    </div>
                    <div className="buttons">
                        <button className="back-button" onClick={() => window.location.href = '/courses'}>Back</button>
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
                .form-group textarea {
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
        </main>
    );
};

export default CourseForm;
