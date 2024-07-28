'use client';

import React, { useState } from 'react';
import NavBar from '@/app/components/NavBar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createClient } from '@supabase/supabase-js'

import supabase from "@/app/components/supabaseClient";
const ServiceRoleForm = () => {
  const [formData, setFormData] = useState({
    serviceRoleName: '',
    description: '',
    building: '',
    room_num: '',
    default_hours: ''
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
      .from('service_role')
      .insert([
        {
          title: formData.serviceRoleName,
          description: formData.description,
          building: formData.building,
          room_num: formData.room_num,
          default_expected_hours: formData.default_hours
        }
      ]);

    if (error) {
      setModalTitle('Error');
      setModalMessage(`Failed to create service role: ${error.message}`);
      setIsSuccess(false);
    } else {
      setModalTitle('Success');
      setModalMessage('Service role created successfully.');
      setIsSuccess(true);
    }

    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
    if (isSuccess) {
      window.location.href = '/service_roles';
    }
  };

  return (
    <>
      <main>
        <NavBar />
        <div className="container">
          <form className="service-form" onSubmit={handleSubmit}>
            <h1>Add New Service Role</h1>

            <div className="form-group">
              <label htmlFor="serviceRoleName">Service Role Name:</label>
              <input
                type="text"
                id="serviceRoleName"
                name="serviceRoleName"
                value={formData.serviceRoleName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="building">Building:</label>
              <input
                type="text"
                id="building"
                name="building"
                value={formData.building}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="room_num">Room Number:</label>
              <input
                type="text"
                id="room_num"
                name="room_num"
                value={formData.room_num}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="default_hours">Default Expected Hours:</label>
              <input
                type="number"
                id="default_hours"
                name="default_hours"
                value={formData.default_hours}
                onChange={handleChange}
                required
              />
            </div>

            <div className="buttons">
              <button type="button" className="back-button" onClick={() => window.location.href = '/service_roles'}>Back</button>
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

export default ServiceRoleForm;
