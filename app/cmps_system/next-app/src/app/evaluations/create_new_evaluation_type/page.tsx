'use client';

import React, { useState } from 'react';
import NavBar from '@/app/components/NavBar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import supabase from "@/app/components/supabaseClient";

const EvaluationTypeForm = () => {
  const [formData, setFormData] = useState({
    evaluation_type_name: '',
    description: '',
    requires_course: false,
    requires_instructor: false,
    requires_service_role: false
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [newEvaluationTypeId, setNewEvaluationTypeId] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Insert evaluation type entry into database
    const { data, error } = await supabase
      .from('evaluation_type')
      .insert([formData])
      .select();

    // Display modal message based on success or failure
    if (error) {
      setModalTitle('Error');
      setModalMessage(`Failed to create evaluation type: ${error.message}`);
      setIsSuccess(false);
    } else {
      setModalTitle('Success');
      setModalMessage('Evaluation Type created successfully.');
      setIsSuccess(true);
      setNewEvaluationTypeId(data[0].evaluation_type_id);
    }

    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
    if (isSuccess) {
      window.location.href = `/evaluations/evaluation_type_info?id=${newEvaluationTypeId}`;
    }
  };

  return (
    <>
      <main>
        <NavBar />
        <div className="container">
          <form className="evaluation-type-form" onSubmit={handleSubmit}>
            <h1>Add New Evaluation Type</h1>

            <div className="form-group">
              <label htmlFor="evaluation_type_name">Evaluation Type Name:</label>
              <input
                type="text"
                id="evaluation_type_name"
                name="evaluation_type_name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="requires_course">Requires Course:</label>
              <input
                type="checkbox"
                id="requires_course"
                name="requires_course"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="requires_instructor">Requires Instructor:</label>
              <input
                type="checkbox"
                id="requires_instructor"
                name="requires_instructor"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="requires_service_role">Requires Service Role:</label>
              <input
                type="checkbox"
                id="requires_service_role"
                name="requires_service_role"
                onChange={handleChange}
              />
            </div>

            <div className="buttons">
              <button className="back-button" type="button" onClick={() => window.location.href = '/evaluations'}>Back</button>
              <button type="submit">Submit</button>
            </div>
          </form>
          <style jsx>{`
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .evaluation-type-form {
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
                <Button variant="primary" onClick={() => window.location.href = `/evaluations/evaluation_type_info?id=${newEvaluationTypeId}`}>
                  Go to new Evaluation Type
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

export default EvaluationTypeForm;
