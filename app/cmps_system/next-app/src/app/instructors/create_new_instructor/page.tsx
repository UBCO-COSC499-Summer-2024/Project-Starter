'use client';

import React, { useState } from 'react';
import NavBar from '@/app/components/NavBar';
import { supabase } from '../../supabaseClient';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const InstructorForm = () => {
  const [formData, setFormData] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    employeeNumber: '',
    suffix: '',
    hireDate: ''
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('instructor')
      .insert([
        {
          prefix: formData.prefix,
          first_name: formData.firstName,
          last_name: formData.lastName,
          ubc_employee_num: formData.employeeNumber,
          suffix: formData.suffix,
          hire_date: formData.hireDate
        }
      ]);

    if (error) {
      setModalTitle('Error');
      setModalMessage(`Failed to create instructor: ${error.message}`);
      setIsSuccess(false);
    } else {
      setModalTitle('Success');
      setModalMessage('Instructor created successfully.');
      setIsSuccess(true);
    }

    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
    if (isSuccess) {
      window.location.href = '/instructors';
    }
  };

  return (
    <>
    <main>
      <NavBar />
      <div className="container">
        <form className="instructor-form" onSubmit={handleSubmit}>
          <h1>Add New Instructor</h1>

          <div className="form-group">
            <label htmlFor="prefix">Prefix:</label>
            <select id="prefix" name="prefix" value={formData.prefix} onChange={handleChange}>
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
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employeeNumber">Employee Number *</label>
            <input
              type="number"
              id="employeeNumber"
              name="employeeNumber"
              value={formData.employeeNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="suffix">Suffix:</label>
            <select id="suffix" name="suffix" value={formData.suffix} onChange={handleChange}>
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
            <input
              type="date"
              id="hireDate"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
            />
          </div>

          <div className="buttons">
            <button type="button" className="back-button" onClick={() => window.location.href = '/instructors'}>Back</button>
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

      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
    </>
  );
};

export default InstructorForm;
