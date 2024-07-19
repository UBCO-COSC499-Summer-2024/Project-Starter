'use client';
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from '@/app/components/NavBar';
import Link from 'next/link';
//import { supabase } from '../supabaseClient'; // Ensure this path is correct
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);

const Account = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [formData, setFormData] = useState({ displayName: '' });
  const [message, setMessage] = useState('');
  const [userUID, setUserUID] = useState('');
  const [phone, setPhone] = useState('');
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
      setUsername(user.email || user.phone); // Use email if available, otherwise use phone
      setPhone(user.phone);

      const displayName = user.user_metadata.display_name || '';
      setDisplayName(displayName);
      setFormData({ displayName });
    };

    checkUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      setMessage('No user is currently logged in!');
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { display_name: formData.displayName },
      });

      if (error) {
        console.error('Error updating profile:', error);
        setMessage('Error updating profile: ' + error.message);
      } else {
        console.log('Profile updated:', data);
        setDisplayName(formData.displayName);
        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Catch Error:', error);
      setMessage(`Error updating profile: ${error.message}`);
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
      window.location.reload(); // Refresh to show the logged-in state
    }
  };

  return (
    <main>
      <Navbar />
      <Container>
        <Card className="mt-5">
          <Card.Body>
            <Card.Title>Account Information</Card.Title>
            {userUID ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formDisplayName">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter display name"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Save
                </Button>
                <Button variant="secondary" type="button" className="mt-3 ml-3" onClick={() => setFormData({ displayName })}>
                  Cancel
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
            {message && <p className="mt-3 text-success">{message}</p>}
          </Card.Body>
        </Card>
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Current User Information</Card.Title>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Display Name:</strong> {displayName}</p>
            <Link href="/account/change-password" passHref>
              <Button variant="secondary" className="mt-3">
                Change Password
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
};

export default Account;
