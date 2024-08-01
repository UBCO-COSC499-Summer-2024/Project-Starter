import Link from 'next/link';
import Navbar from '@/app/components/NavBar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Tools() {
    /**
     * This page is the tools page. It contains buttons that allow the user to access the tools. The user can access the course assign page, create a new account page, 
     * delete an account page, and change the password of an account page. The user can click on the buttons to navigate to the corresponding page.
     */ 
    return (
        <main>
            <Navbar />
            <Container>
                <h1>Tools Page For Head and Staff</h1>
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
            </Container>
        </main>
    );
}
