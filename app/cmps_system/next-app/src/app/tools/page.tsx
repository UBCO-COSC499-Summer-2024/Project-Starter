'use client';

import Link from 'next/link';
import Navbar from '@/app/components/NavBar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Tools() {
    return (
        <main>
            <Navbar />
            <Container>
                <h1>Tools Page</h1>
                <Link href="/course-assign" passHref>
                    <Button variant="secondary" className="mt-2">Course Assign</Button>
                </Link>
                <br />
                <Link href="/tools/create-new-account" passHref>
                    <Button variant="secondary" className="mt-2">Create a new account</Button>
                </Link>
                <br />
                <Link href="/tools/delete-an-account" passHref>
                    <Button variant="danger" className="mt-2">Delete an account</Button>
                </Link>
                <br />
                <Link href="/tools/change-account-password" passHref>
                    <Button variant="warning" className="mt-2">Change the Password of an account</Button>
                </Link>
                <br />
                <Link href="/tools/export" passHref>
                    <Button variant="success" className="mt-2">Export as Excel</Button>
                </Link>

            </Container>
        </main>
    );
}
