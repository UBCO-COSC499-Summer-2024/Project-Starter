'use client';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from '@/app/components/NavBar';
import { useRouter } from 'next/navigation';
import supabase from "@/app/components/supabaseClient";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        setMessage('No user is currently logged in!');
        return;
      }
    };

    checkUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') setCurrentPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmNewPassword') setConfirmNewPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match!');
      return;
    }

    try {
      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        setMessage('No user is currently logged in!');
        return;
      }

      // Reauthenticate the user with the current password using email
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        // Restore the previous session if sign in fails
        await supabase.auth.setSession(sessionData.session);
        setMessage('Current password is incorrect!');
        return;
      }

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setMessage('Password updated successfully!');
    } catch (error) {
      setMessage(`Error updating password: ${error.message}`);
    }
  };

  return (
    <main>
      <Navbar />
      <Container>
        <Card className="mt-5">
          <Card.Body>
            <Card.Title>Change Password</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCurrentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter current password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formNewPassword" className="mt-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formConfirmNewPassword" className="mt-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Change Password
              </Button>
            </Form>
            {message && (
              <div>
                <p
                  className="mt-3"
                  style={{
                    color:
                      message.includes('Error') || message.includes('incorrect') || message === 'New passwords do not match!'
                        ? 'red'
                        : 'green',
                  }}
                >
                  {message}
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
};

export default ChangePassword;
