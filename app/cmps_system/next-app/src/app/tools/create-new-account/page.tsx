'use client';

import React, { useState } from 'react';
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
const supabaseServiceKey = window.sessionStorage.getItem('supabaseServiceKey') ? window.sessionStorage.getItem('supabaseServiceKey') : "null";
console.log({"key":supabaseServiceKey})

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default function CreateNewAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error, data } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Account created successfully and email confirmed!');
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };
  if(supabaseServiceKey === "null"){
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
            <Card.Title>Create a New Account</Card.Title>
            <Form onSubmit={handleSubmit}>
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

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Create
              </Button>
            </Form>
            {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
            {successMessage && <p className="text-success mt-3">{successMessage}</p>}
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}
