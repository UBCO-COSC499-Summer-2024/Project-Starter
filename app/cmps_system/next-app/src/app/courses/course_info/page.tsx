'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import supabase from "@/app/components/supabaseClient";

const CourseInfo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('id');

  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [tas, setTas] = useState([]);

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const { data: courseData, error: courseError } = await supabase
            .from('course')
            .select('*')
            .eq('course_id', courseId)
            .single();

          if (courseError) throw courseError;
          setCourse(courseData);

          const { data: assigneeData, error: assigneeError } = await supabase
            .from('v_course_info_assignees')
            .select('*')
            .eq('course_id', courseId);

          if (assigneeError) throw assigneeError;

          setInstructors(assigneeData.filter(assignee => assignee.position === 'Instructor'));
          setTas(assigneeData.filter(assignee => assignee.position === 'TA'));

        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCourseData();
    }
  }, [courseId]);

  const handleDelete = async () => {
    setModalShow(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('course')
        .delete()
        .eq('course_id', courseId);
      if (error) throw error;
      alert('Course removed successfully');
      router.push('/courses');
    } catch (error) {
      setError(error.message);
    }
  };

  const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  return (
    <div>
      <NavBar />
      <Container fluid className="banner">
        <h2>Course Info</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching course: {error}</p>
        ) : course ? (
          <Row>
            <Col md={6}>
              <Table className="table table-bordered">
                <tbody>
                  {Object.entries(course).map(([field, value]) => (
                    <tr key={field}>
                      <td style={{ width: '30%' }}>{toTitleCase(field.replace(/_/g, ' '))}</td>
                      <td>{value !== null ? value.toString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <h3>Assigned Instructors</h3>
              <Table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Instructor Name</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((instructor) => (
                    <tr key={instructor.assignment_id}>
                      <td>{instructor.instructor_name}</td>
                      <td>{instructor.position}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h3>Assigned TAs</h3>
              <Table className="table table-bordered">
                <thead>
                  <tr>
                    <th>TA Name</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody>
                  {tas.map((ta) => (
                    <tr key={ta.assignment_id}>
                      <td>{ta.instructor_name}</td>
                      <td>{ta.position}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        ) : (
          <p>Course not found</p>
        )}
        <div className="course-info-footer">
          <Button className="btn btn-danger" onClick={handleDelete}>Remove this course</Button>
          <Button className="btn btn-secondary" onClick={() => router.push('/courses')}>Back</Button>
        </div>
      </Container>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this course?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseInfo;
