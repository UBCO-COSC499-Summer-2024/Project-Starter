import { Button, Card, Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function Home() {
    return (
        <div className="tw-grid tw-place-content-center tw-mt-40">
            <Card className="tw-w-96 tw-rounded-lg tw-bg-slate-500 tw-text-center tw-p-10">
                <b>Login or Signup</b>
                <Form.Control
                className="tw-grid tw-place-content-center tw-mt-6"
                placeholder="Email"
                aria-label="email"
                type="email"
                aria-describedby="basic-addon1"
                 />
                <Link href="/dashboard">
                    <Button className="tw-m-3 tw-w-24">Login</Button>
                </Link>
                <Container>
                    <Row>
                        <Col>
                        <Link href="/dashboard">
                    <Button className="tw-m-3 tw-w-24">With Google</Button>
                </Link>
                </Col><Col>
                <Link href="/dashboard">
                    <Button className="tw-m-3 tw-w-24 bg-gray-800 hover:bg-gray-900">With GitHub</Button>
                </Link></Col>
                    </Row>
                </Container>
            </Card>
        </div>
    )
}

  
