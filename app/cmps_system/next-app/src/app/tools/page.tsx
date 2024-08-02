'use client'
import Link from 'next/link';
import Navbar from '@/app/components/NavBar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import getUserType from '../components/getUserType';
import { Form } from 'react-bootstrap';

export default function Tools() {
    /**
     * This page is the tools page. It contains buttons that allow the user to access the tools. The user can access the course assign page, create a new account page, 
     * delete an account page, and change the password of an account page. The user can click on the buttons to navigate to the corresponding page.
     * 
     * This page checks if user is an instructor, head, or staff. If the user is an instructor, it will show 403 error. However, this is only frontend validation and meant to 
     * not make user confused. The real security means that prevent unauthorized access is implemented is by requiring user to enter the service. As mentioend in #649, this key 
     * should not be stored in any places in the code. 
     * 
     * Important decision choice reasoning please check this copied from #649
     * In the code [here](https://github.com/UBCO-COSC499-Summer-2024/team-12-capstone-team-12/blob/development/app/cmps_system/next-app/src/app/tools/change-account-password/page.tsx), there is a significant security issue. This page allows users to change the password for someone else, which is a major security flaw. One team member argued that this isn't a problem because normal users do not know this page exists. However, security through obscurity is not a valid protection method.
     *   Upon reviewing the code, I found that the service key (not the anon key) is hardcoded on this page. This is highly problematic because it grants all users administrative privileges, which should never happen.
     *   Another team member pointed out that there is a check to ensure the user is a head user and displays an access denied message if not. However, this check is implemented only on the front end and should not be relied upon for security.
     *   It's important to note that placing the service key in a public environment file is not a solution, as it still gets passed to the client. The service key should never be used in this way.
     *   Team members should always consider security when making decisions and avoid implementing code "just because it works." Proper backend protections and best practices must be followed to ensure the application's security.
    */
    const [userType, setUserType] = useState('');
    const adminkey = useRef(null);
    const [supabaseServiceKey, setSupabaseServiceKey] = useState(sessionStorage.getItem('supabaseServiceKey') ? sessionStorage.getItem('supabaseServiceKey') : "null")
    useEffect(() => {
        getUserType().then((res) => {
            setUserType(res);
        });
    }, []);
    return (
        <main>
            <Navbar />
            {userType === 'instructor' ? <h1>403 Forbidden</h1> : <Container>

                <h1>Tools Page For Head and Staff</h1>
                <h3>Dangerous Area - You need to enter admin key everytime you want to perfomance dangerous operation. You should obtain this from system admin and you should keep it in a safe location. (such as password manager)</h3>

                <Form.Control type="password" ref={adminkey} placeholder="Enter Admin Key" className="tw-mt-2" />
                <Button onClick={() => {
                    setSupabaseServiceKey(adminkey.current.value);
                    sessionStorage.setItem('supabaseServiceKey', adminkey.current.value);
                    alert("Admin Key Set");
                }}>Set Admin Key</Button><br />
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
