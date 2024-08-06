'use client'
import Navbar from '@/app/components/NavBar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import { Form, FormControl, Row, Col } from 'react-bootstrap';
import main from './gpt';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function Tools() {
    const input = useRef(null);
    const [response, setResponse] = useState("");
    const [question, setQuestion] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [markdownContent, setMarkdownContent] = useState("");

    useEffect(() => {
        fetch('/help.md')
            .then((response) => response.text())
            .then((text) => setMarkdownContent(text));
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const { hash } = window.location;
            if (hash) {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Scroll to the anchor when the component is first loaded

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            await sendMessage();
        }
    };

    const sendMessage = async () => {
        setQuestion(input.current.value);
        setResponse("Loading...");
        const aiResponse = await main(input.current.value, markdownContent);
        setResponse(aiResponse.text);
        input.current.value = "";
    };

    return (
        <main>
            <Navbar />
            <div className="tw-p-10">
                <Container>
                    <div className="position-relative">
                        <Button
                            variant="primary"
                            onClick={() => setShowModal(true)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                zIndex: 1000
                            }}
                        >
                            Ask the AI Assistant for help
                        </Button>
                    </div>
                    <Row>
                        <Col>
                            <MarkdownRenderer filePath="/help.md" />
                        </Col>
                    </Row>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Ask AI for help</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <div className="tw-p-10">{question}</div>
                                <div className="tw-p-10">{response}</div>
                                <FormControl
                                    type="text"
                                    ref={input}
                                    placeholder="Input questions"
                                    className="tw-mt-2"
                                    onKeyPress={handleKeyPress}
                                />
                                <Button className="tw-mt-2" onClick={sendMessage}>
                                    Send
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
        </main>
    );
}
