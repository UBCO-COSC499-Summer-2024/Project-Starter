'use client'
import { useState, useEffect } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    async function handleResetPassword() {
        if (!newPassword || !confirmPassword) {
            setErrorMessage('Please enter and confirm your new password.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        // Reset password logic
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            setErrorMessage('Error resetting password.');
            console.error(error);
        } else {
            setErrorMessage('');
            setSuccessMessage('Password reset successfully. You can now log in with your new password.');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
    }

    return (
        <div className="tw-grid tw-place-content-center tw-mt-40 tw-bg-white">
            <Card className="tw-w-96 tw-rounded-lg tw-bg-white tw-text-center tw-p-10 tw-border-white tw-place-content-center">
                <b className="tw-text-2xl">Update Password</b>
                {errorMessage && <Alert variant="danger" className="tw-mt-4">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success" className="tw-mt-4">{successMessage}</Alert>}

                <div>
                    <Form.Control
                        className="tw-grid tw-mt-6 tw-m-3"
                        placeholder="New Password"
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
                        Update Password
                    </Button>
                </div>
            </Card>
        </div>
    );
}
