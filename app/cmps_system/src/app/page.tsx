'use client'
import Image from "next/image";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavbarBrand from 'react-bootstrap/NavbarBrand';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/esm/Card";
import { Col, Row } from "react-bootstrap";

export default function Home() {
  return (
    <main>
      <Navbar style={{ backgroundColor: "#002145" }} expand="lg">
        <Container>
          <NavbarBrand><b className="tw-text-white">CMPS Department Management System</b></NavbarBrand>
        </Container>
      </Navbar>
      <Container>
        <Row className="tw-pt-10">
          <Col className="tw-grid tw-text-center tw-place-content-center">
            <img className="tw-w-80" src="/head.png"></img>
            <Button>Login as Dept Head</Button>
          </Col>
          <Col className="tw-grid tw-text-center tw-place-content-center">
            <img className="tw-w-80" src="/staff.webp"></img>
            <Button>Login as Dept Staff</Button>
          </Col>
          <Col className="tw-grid tw-text-center tw-place-content-center">
            <img className="tw-w-80" src="/instructor.png"></img>
            <Button onClick={()=>{window.location='/instructor_dashboard/individual'}}>Login as Instructor</Button>
          </Col>
        </Row>
      </Container>
      <div className="tw-absolute tw-m-10 tw-right-10">
      <a href="#">Help</a>
      </div>
    </main>
  );
}
