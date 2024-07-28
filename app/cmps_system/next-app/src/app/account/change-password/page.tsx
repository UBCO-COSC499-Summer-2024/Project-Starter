'use client';
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from '@/app/components/NavBar';
//import { supabase } from '../../supabaseClient'; // Ensure this path is correct
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js'
import supabase from "@/app/components/supabaseClient";
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userUID, setUserUID] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const phoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session Data:', sessionData);
      console.log('Session Error:', sessionError);

      if (sessionError || !sessionData.session) {
        setMessage('No user is currently logged in!');
        return;
      }

      const user = sessionData.session.user;
      setUserUID(user.id);
      setPhone(user.phone);
      setMessage(`User is logged in with UID: ${user.id}`);
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
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Session Data on Submit:', sessionData);

      const user = sessionData?.session?.user;

      if (!user) {
        setMessage('No user is currently logged in!');
        return;
      }

      console.log('User:', user);

      // Reauthenticate the user with the current password using phone number
      const { error: signInError } = await supabase.auth.signInWithPassword({
        phone: user.phone,
        password: currentPassword,
      });

      console.log('Sign In Error:', signInError);

      if (signInError) {
        setMessage('Current password is incorrect!');
        return;
      }

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      console.log('Update Error:', updateError);

      if (updateError) throw updateError;

      setMessage('Password updated successfully!');
    } catch (error) {
      console.log('Catch Error:', error);
      setMessage(`Error updating password: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    const phone = phoneInputRef.current.value;
    const password = passwordInputRef.current.value;
    let { error } = await supabase.auth.signInWithPassword({
      phone: phone,
      password: password,
    });
    if (error) {
      setMessage("Invalid phone or password");
    } else {
      setMessage("Logged in successfully!");
      router.push("/account/change-password"); // Refresh to show the logged-in state
    }
  };

  return (
    <main>
      <Navbar />
      <Container>
        <Card className="mt-5">
          <Card.Body>
            <Card.Title>Change Password</Card.Title>
            {userUID ? (
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
            ) : (
              <div>
                <p>{message}</p>
                <Form>
                  <Form.Control
                    className="tw-grid tw-mt-6 tw-m-3"
                    placeholder="Phone"
                    aria-label="phone"
                    type="phone"
                    ref={phoneInputRef}
                  />
                  <Form.Control
                    className="tw-grid tw-mt-6 tw-m-3"
                    placeholder="Password"
                    aria-label="password"
                    type="password"
                    ref={passwordInputRef}
                  />
                  <Button variant="primary" onClick={handleLogin} className="mt-3">
                    Login
                  </Button>
                </Form>
              </div>
            )}
            {message && (
              <div>
                <p className="mt-3 text-success">{message}</p>
                {message === 'No user is currently logged in!' && (
                  <Form>
                    <Form.Control
                      className="tw-grid tw-mt-6 tw-m-3"
                      placeholder="Phone"
                      aria-label="phone"
                      type="phone"
                      ref={phoneInputRef}
                    />
                    <Form.Control
                      className="tw-grid tw-mt-6 tw-m-3"
                      placeholder="Password"
                      aria-label="password"
                      type="password"
                      ref={passwordInputRef}
                    />
                    <Button variant="primary" onClick={handleLogin} className="mt-3">
                      Login
                    </Button>
                  </Form>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
};

export default ChangePassword;
