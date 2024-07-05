'use client'
// assisted by copilot
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { createClient } from '@supabase/supabase-js'
import { useRef } from "react"; 

export default function Home() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
    const phone_input = useRef(null)
    const password_input = useRef(null)
    async function signup(){
        const phone = phone_input.current.value;
        const password = password_input.current.value;
        let { data, error } = await supabase.auth.signUp({
            phone: phone,
            password: password,
          })
        alert("Signed up successfully!")
    }
    async function login(){
        const phone = phone_input.current.value;
        const password = password_input.current.value;
        let { data, error } = await supabase.auth.signInWithPassword({
            phone: phone,
            password: password,
          })
    }
    return (
        <div className="tw-grid tw-place-content-center tw-mt-40 tw-bg-white  ">
            <Card className="tw-w-96 tw-rounded-lg  tw-bg-white tw-text-center tw-p-10 tw-border-white tw-place-content-center">
                <b className="tw-text-2xl">Login or Signup</b>
                <Form.Control
                className="tw-grid tw-mt-6 tw-m-3"
                placeholder="phone"
                aria-label="phone"
                type="phone"
                aria-describedby="basic-addon1"
                ref={phone_input}
                 />
                <Form.Control
                className="tw-grid tw-mt-6 tw-m-3"
                placeholder="Password"
                aria-label="password"
                type="password"
                aria-describedby="basic-addon1"
                ref={password_input}
                 />
                <Button className="tw-m-3 tw-bg-slate-800 tw-border-white" onClick={signup}>Signup</Button>
                <Button className="tw-m-3 tw-bg-slate-800 tw-border-white" onClick={login}>Login</Button>

            </Card>
        </div>
    )
}


