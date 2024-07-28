'use client'
import { Button, Card, Form, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createClient } from '@supabase/supabase-js';
import { useRef, useState } from "react"; 
import { useRouter } from 'next/navigation';
import supabase from "@/app/components/supabaseClient";

export default function Home() {
    const router = useRouter();
    const email_input = useRef(null);
    const password_input = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    async function signup() {
        const email = email_input.current.value;
        const password = password_input.current.value;

        // Validation
        if (!email || !password) {
            setErrorMessage('email and password are required.');
            setSuccessMessage('');
            return;
        }

        setLoading(true);
        let { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        setLoading(false);

        if (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');
        } else {
            setErrorMessage('');
            setSuccessMessage('Signed up successfully! You can now log in after verify your email!');
        }
    }

    async function login() {
        const email = email_input.current.value;
        const password = password_input.current.value;

        // Validation
        if (!email || !password) {
            setErrorMessage('Email and password are required.');
            setSuccessMessage('');
            return;
        }

        setLoading(true);
        let response = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        setLoading(false);

        if (response.error) {
            setErrorMessage('Invalid email or password or email unverified.');
            setSuccessMessage('');
        } else {
            setErrorMessage('');
            setSuccessMessage('');
            router.push("/dashboard");
        }
    }

    return (
        <div className="tw-grid tw-place-content-center tw-mt-40 tw-bg-white">
            <Card className="tw-w-96 tw-rounded-lg tw-bg-white tw-text-center tw-p-10 tw-border-white tw-place-content-center">
                <b className="tw-text-2xl">Login or Signup</b>
                {errorMessage && <Alert variant="danger" className="tw-mt-4">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success" className="tw-mt-4">{successMessage}</Alert>}
                <Form.Control
                    className="tw-grid tw-mt-6 tw-m-3"
                    placeholder="email"
                    aria-label="email"
                    type="email"
                    aria-describedby="basic-addon1"
                    ref={email_input}
                />
                <Form.Control
                    className="tw-grid tw-mt-6 tw-m-3"
                    placeholder="Password"
                    aria-label="password"
                    type="password"
                    aria-describedby="basic-addon1"
                    ref={password_input}
                />
                <Button
                    className="tw-m-3 tw-bg-slate-800 tw-border-white"
                    onClick={signup}
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Signup'}
                </Button>
                <Button
                    className="tw-m-3 tw-bg-slate-800 tw-border-white"
                    onClick={login}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </Card>
        </div>
    );
}

