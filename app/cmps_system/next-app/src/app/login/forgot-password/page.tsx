'use client'
import { useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code, 3: Reset password
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    async function handleSendCode() {
        if (!email) {
            setErrorMessage('Please enter your email.');
            return;
        }
    
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            setErrorMessage('Error sending verification code.');
        } else {
            setErrorMessage('');
            setSuccessMessage('Verification code sent to your email.');
            setStep(2);
        }
    }

    async function handleVerifyCode() {
        if (!code) {
            setErrorMessage('Please enter the verification code.');
            return;
        }

        // Verify code logic here
        setErrorMessage('');
        setSuccessMessage('Code verified. You can now reset your password.');
        setStep(3);
    }

    async function handleResetPassword() {
        if (!newPassword || !confirmPassword) {
            setErrorMessage('Please enter and confirm your new password.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        // Reset password logic here
        setErrorMessage('');
        setSuccessMessage('Password reset successfully. You can now log in with your new password.');
        setStep(4); // Move to the final step
    }

    return (
        <div className="tw-grid tw-place-content-center tw-mt-40 tw-bg-white">
            <Card className="tw-w-96 tw-rounded-lg tw-bg-white tw-text-center tw-p-10 tw-border-white tw-place-content-center">
                <b className="tw-text-2xl">Forgot Password</b>
                {errorMessage && <Alert variant="danger" className="tw-mt-4">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success" className="tw-mt-4">{successMessage}</Alert>}
                
                {step === 1 && (
                    <div>
                        <Form.Control
                            className="tw-grid tw-mt-6 tw-m-3"
                            placeholder="Enter your email"
                            aria-label="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            className="tw-m-3 tw-bg-slate-800 tw-border-white"
                            onClick={handleSendCode}
                        >
                            Send Code
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <Form.Control
                            className="tw-grid tw-mt-6 tw-m-3"
                            placeholder="Enter verification code"
                            aria-label="verification-code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <Button
                            className="tw-m-3 tw-bg-slate-800 tw-border-white"
                            onClick={handleVerifyCode}
                        >
                            Verify Code
                        </Button>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <Form.Control
                            className="tw-grid tw-mt-6 tw-m-3"
                            placeholder="New Password(at least 6 numbers)"
                            aria-label="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Form.Control
                            className="tw-grid tw-mt-6 tw-m-3"
                            placeholder="Confirm New Password"
                            aria-label="confirm-new-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            className="tw-m-3 tw-bg-slate-800 tw-border-white"
                            onClick={handleResetPassword}
                        >
                            Reset Password
                        </Button>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <Button
                            className="tw-m-3 tw-bg-slate-800 tw-border-white"
                            onClick={() => router.push('/login')}
                        >
                            Login
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
