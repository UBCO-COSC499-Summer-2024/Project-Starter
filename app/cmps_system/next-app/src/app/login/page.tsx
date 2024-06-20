import { Button, Card, Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function Home() {
    return (
        <div className="tw-grid tw-place-content-center tw-mt-40 tw-bg-white  ">
            <Card className="tw-w-96 tw-rounded-lg  tw-bg-white tw-text-center tw-p-10">
                <b>Login or Signup</b>
                <Form.Control
                className="tw-grid tw-place-content-center tw-mt-6"
                placeholder="Email"
                aria-label="email"
                type="email"
                aria-describedby="basic-addon1"
                 />
                <Link href="/dashboard">
                    <Button className="tw-m-3 tw-bg-slate-800 tw-w-72">Login</Button>
                </Link>
 
                    
                        <Link href="/dashboard">
                    <Button className="tw-m-3 tw-bg-neutral-200 tw-text-slate-950 tw-w-72">With Google</Button>
                </Link>

                <Link href="/dashboard">
                    <Button className="tw-m-3 tw-bg-neutral-200 tw-text-slate-950 tw-w-72">With GitHub</Button>
                </Link>
            </Card>
        </div>
    )
}

  
