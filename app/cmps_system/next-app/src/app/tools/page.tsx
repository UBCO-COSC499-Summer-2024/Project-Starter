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
            </Container>
        </main>
    );
}
