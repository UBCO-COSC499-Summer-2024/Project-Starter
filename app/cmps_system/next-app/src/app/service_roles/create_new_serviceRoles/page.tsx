'use client'
import React from 'react';
import NavBar from '@/app/components/NavBar';

const CourseForm = () => {
    return (
        <main>
            <NavBar />
            <div className="container">
                <form className="service-form">
                    <h1>Add New Service Roles</h1>
                    <div className="form-group">
                        <label htmlFor="serviceCode">Service Code:</label>
                        <input type="text" id="serviceCode" name="serviceCode" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="serviceRolesName">Service Roles Names:</label>
                        <input type="text" id="serviceRolesName" name="serviceRolesName" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="instructorName">Instructor Name:</label>
                        <input type="text" id="instructorName" name="instructorName" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="session">Session:</label>
                        <input type="text" id="session" name="session" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hours">Hours:</label>
                        <input type="text" id="hours" name="hours" required />
                    </div>
                    <div className="buttons">
                        <button className="back-button" onClick={() => window.location.href = '/service_roles'}>Back</button>
                        <button type="submit">Submit</button>
                    </div>

                </form>
                <style jsx>{`
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .service-form {
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
