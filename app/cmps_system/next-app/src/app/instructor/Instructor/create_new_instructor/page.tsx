'use client'
import React from 'react';
import NavBar from '@/app/components/NavBar';

const InstructorForm = () => {
    return (
        <main>
            <NavBar />
            <div className="container">
                <form className="instructor-form">
                    <h1>Add New Instructor</h1>

                    <div className="form-group">
                        <label htmlFor="prefix">Prefix:</label>
                        <select id="prefix" name="prefix">
                            <option value="">Select Prefix</option>
                            <option value="Mr">Mr.</option>
                            <option value="Ms">Ms.</option>
                            <option value="Mrs">Mrs.</option>
                            <option value="Dr">Dr.</option>
                            <option value="Count">Count</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input type="text" id="lastName" name="lastName" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="employeeNumber">Employee Number *</label>
                        <input type="number" id="employeeNumber" name="employeeNumber" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="suffix">Suffix:</label>
                        <select id="suffix" name="suffix">
                            <option value="">Select Suffix</option>
                            <option value="Jr">Jr.</option>
                            <option value="Sr">Sr.</option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III.</option>
                            <option value="thegrey">The grey</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="hireDate">Hire Date:</label>
                        <input type="date" id="hireDate" name="hireDate" />
                    </div>

                    <div className="buttons">
                        <button className="back-button" onClick={() => window.location.href = '/instructor/Instructor'}>Back</button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
                <style jsx>{`
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .instructor-form {
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

export default InstructorForm;