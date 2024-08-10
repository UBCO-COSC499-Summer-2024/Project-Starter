'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from '@/app/components/NavBar';
import { createClient } from '@supabase/supabase-js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL;
/** Here we check if the service key is in the session storage, if not we will use null as place holder as supabase dose not allow empty key. This null key
 * should throw an error if the user tried to perfome any operations. 
 */

export default function ChangeAccountPassword() {
    const [supabaseAdmin, setSupabaseAdmin] = useState(null);
    const [supabaseServiceKey, setSupabaseServiceKey] = useState("null");
    useEffect(() => {
        const supabaseServiceKey = window.sessionStorage.getItem('supabaseServiceKey') ? window.sessionStorage.getItem('supabaseServiceKey') : "null";
        setSupabaseAdmin(createClient(supabaseUrl, supabaseServiceKey));
    }, [])
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const { data, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) {
            setError('Failed to fetch user information.');
        } else {
            // @ts-ignore
            const user = data.users.find((user) => user.email === email);
            if (!user) {
                setError('Email does not exist.');
            } else {
                const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
                    password: newPassword,
                });

                if (error) {
                    setError('Failed to change the password.');
                } else {
                    setSuccessMessage(`Password for ${email} has been changed successfully.`);
                }
            }
        }
    };
    if (supabaseServiceKey === "null") {
        /** if the service key is null, it will show 403. Note that this is only front end practise to inform user. */
        return (
            <main>
                <Navbar />
                <Container>
                    <h1>403 Forbidden - Invalid Key </h1>
                </Container>
            </main>
        );
    }
    return (
        <main>
            <Navbar />
            <Container>
                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>Change the Password of an Account</Card.Title>
                        <Form onSubmit={handleChangePassword}>
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
                            <Form.Group controlId="formNewPassword" className="mt-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formConfirmPassword" className="mt-3">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {error && <p className="text-danger mt-3">{error}</p>}
                            {successMessage && <p className="text-success mt-3">{successMessage}</p>}
                            <Button variant="warning" type="submit" className="mt-3">
                                Change Password
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </main>
    );
}
