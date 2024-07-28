'use client';

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Navbar from '@/app/components/NavBar';
import { createClient } from '@supabase/supabase-js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL;
const supabaseServiceKey =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q"; // Use the service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default function DeleteAnAccount() {
    const [email, setEmail] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userId, setUserId] = useState('');

    const handleDelete = async () => {
        setError('');
        setSuccessMessage('');

        const { data, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) {
            setError('Failed to fetch user information.');
        } else {
            const user = data.users.find((user) => user.email === email);
            if (!user) {
                setError('Email does not exist.');
            } else {
                setUserId(user.id);
                setShowConfirmModal(true);
            }
        }
    };

    const confirmDelete = async () => {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) {
            setError('Failed to delete the account.');
        } else {
            setSuccessMessage(`Account with email ${email} has been deleted successfully.`);
            setShowConfirmModal(false);
            setEmail('');
        }
    };

    return (
        <main>
            <Navbar />
            <Container>
                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>Delete an Account</Card.Title>
                        <Form>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {error && <p className="text-danger">{error}</p>}
                            {successMessage && <p className="text-success">{successMessage}</p>}
                            <Button variant="danger" className="mt-3" onClick={handleDelete}>
                                Delete this account
                            </Button>
                        </Form>

                        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this account: {email}?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={confirmDelete}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Card.Body>
                </Card>
            </Container>
        </main>
    );
}
