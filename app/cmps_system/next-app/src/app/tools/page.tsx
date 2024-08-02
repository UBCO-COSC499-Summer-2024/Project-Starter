import Link from 'next/link';
import Navbar from '@/app/components/NavBar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import getUserType from '../components/getUserType';

export default function Tools() {
    /**
     * This page is the tools page. It contains buttons that allow the user to access the tools. The user can access the course assign page, create a new account page, 
     * delete an account page, and change the password of an account page. The user can click on the buttons to navigate to the corresponding page.
     * 
     * This page checks if user is an instructor, head, or staff. If the user is an instructor, it will show 403 error. However, this is only frontend validation and meant to 
     * not make user confused. The real security means that prevent unauthorized access is implemented is by requiring user to enter the service. As mentioend in #649, this key 
     * should not be stored in any places in the code. 
     */ 
    const [userType, setUserType] = useState('');
    useEffect(() => {
        getUserType().then((res) => {
            setUserType(res);
        });
    }, []);
    return (
        <main>
            <Navbar />
            {userType === 'instructor' ? <h1>403 Forbidden</h1> :     <Container>
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
                <br />
                <Link href="/tools/export" passHref>
                    <Button variant="success" className="mt-2">Export as Excel</Button>
                </Link>
            </Container>}
        </main>
    );
}
