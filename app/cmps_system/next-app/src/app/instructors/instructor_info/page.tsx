'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import { supabase } from '../../supabaseClient';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';

const InstructorInfo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const ubcEmployeeNum = searchParams.get('ubcEmployeeNum');
  const title = searchParams.get('title');
  const hireDate = searchParams.get('hireDate');

  const [instructor, setInstructor] = useState({
    first_name: firstName,
    last_name: lastName,
    ubc_employee_num: ubcEmployeeNum,
    title,
    hire_date: hireDate,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchInstructorData = async () => {
        try {
          const { data: instructorData, error: instructorError } = await supabase
            .from('instructor')
            .select('*')
            .eq('instructor_id', id)
            .single();

          if (instructorError) throw instructorError;
          setInstructor(instructorData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchInstructorData();
    }
  }, [id]);

  const handleDelete = async () => {
    setModalShow(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('instructor')
        .delete()
        .eq('instructor_id', id);
      if (error) throw error;
      alert('Instructor removed successfully');
      router.push('/instructors');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <Container fluid className="banner">
        <h2>Instructor Info</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching instructor: {error}</p>
        ) : instructor ? (
          <>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>First Name</td>
                  <td>{instructor.first_name}</td>
                </tr>
                <tr>
                  <td>Last Name</td>
                  <td>{instructor.last_name}</td>
                </tr>
                <tr>
                  <td>Employee Number</td>
                  <td>{instructor.ubc_employee_num}</td>
                </tr>
                <tr>
                  <td>Title</td>
                  <td>{instructor.title}</td>
                </tr>
                <tr>
                  <td>Hire Date</td>
                  <td>{instructor.hire_date}</td>
                </tr>
              </tbody>
            </table>
            <div className="instructor-info-footer">
              <button className="btn btn-danger" onClick={handleDelete}>Remove this instructor</button>
              <button className="btn btn-secondary" onClick={() => router.push('/instructors')}>Back</button>
            </div>
          </>
        ) : (
          <p>Instructor not found</p>
        )}
      </Container>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to remove this instructor?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InstructorInfo;
