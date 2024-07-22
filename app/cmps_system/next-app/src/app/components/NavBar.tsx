'use client'
import Link from 'next/link';
import Image from 'next/image';
import styles from './NavBar.module.css';
import { createClient } from '@supabase/supabase-js/dist/module';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const NavBar = () => {
    const [email, setEmail] = useState("")
    useEffect(() => {
        (async function () {
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY); //copilot

            // get user info, semi-copilot
            const user = await supabase.auth.getUser()
            console.log(user)
            setEmail(user.data.user.email)
        })()
    }, [])

    const pages = [
        { name: "📊Dashboard", url: "/dashboard" },
        { name: "👩🏻‍🏫Instructors", url: "/instructors" },
        { name: "📖Courses", url: "/courses" },
        { name: "💼Service Roles", url: "/service_roles" },
        { name: "💯Evaluations", url: "/evaluations" },
        { name: "🕒Service Roles Tracking", url: "/time_tracking" },
        { name: "🎯Benchmark", url: "/time_tracking/benchmarks" },
        { name: "🛠️Tools", url: "/tools" },
    ]
    return (
        <Navbar expand="sm" style={{ color: "white" }} style={{ backgroundColor: "#0055B7" }}>
            <Container>
                {/* <Navbar.Brand href="/">CMPS Mangement System</Navbar.Brand> */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse style={{marginLeft: "10px"}}  id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {
                            (pages).map((page, index) => (
                                <>
                                    <Nav.Link style={{ color: "white", paddingLeft: "10px", fontSize: "small" }} key={index} href={page.url}>{page.name}</Nav.Link>
                                </>
                            ))
                        }
                    </Nav>
                </Navbar.Collapse>

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <a style={{ color: "white" }} href="/account">Account</a>
                    </Navbar.Text>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
};

export default NavBar;
