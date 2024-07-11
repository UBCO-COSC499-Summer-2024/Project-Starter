'use client';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from '@/app/components/NavBar';
import Link from 'next/link';

const Account = () => {
  const [username, setUsername] = useState('john_doe');
  const [formData, setFormData] = useState({
    username: 'john_doe',
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(formData.username);
    setMessage('Profile updated successfully!');
  };

  return (
    <main>
      <Navbar />
      <Container>
        <Card className="mt-5">
          <Card.Body>
            <Card.Title>Account Information</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Update Profile
              </Button>
            </Form>
            {message && <p className="mt-3 text-success">{message}</p>}
          </Card.Body>
        </Card>
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Current User Information</Card.Title>
            <p><strong>Username:</strong> {username}</p>
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
