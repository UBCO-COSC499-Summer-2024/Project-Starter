'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import { supabase } from '../../../supabaseClient';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';

const InstructorDetail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [instructor, setInstructor] = useState(null);
  const [serviceRoles, setServiceRoles] = useState([]);
  const [teachingAssignments, setTeachingAssignments] = useState([]);
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

          const { data: serviceRoleData, error: serviceRoleError } = await supabase
            .from('service_role_assign')
            .select('*, service_role(title)')
            .eq('instructor_id', id);

          if (serviceRoleError) throw serviceRoleError;
          setServiceRoles(serviceRoleData);

          const { data: teachingAssignmentData, error: teachingAssignmentError } = await supabase
            .from('course_assign')
            .select('*, course(course_title)')
            .eq('instructor_id', id);

          if (teachingAssignmentError) throw teachingAssignmentError;
          setTeachingAssignments(teachingAssignmentData);
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
    const { error } = await supabase
      .from('instructor')
      .delete()
      .eq('instructor_id', id);
    if (error) {
      setError(error.message);
    } else {
      alert('Instructor removed successfully');
      router.push('/instructor/Instructor');
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
                  <td>Name</td>
                  <td>{instructor.prefix} {instructor.first_name} {instructor.last_name}</td>
                </tr>
                <tr>
                  <td>Employee Number</td>
                  <td>{instructor.ubc_employee_num}</td>
                </tr>
                <tr>
                  <td>Position/Title</td>
                  <td>{instructor.title}</td>
                </tr>
                <tr>
                  <td>Service Roles</td>
                  <td>{serviceRoles.length > 0 ? serviceRoles.map(role => role.service_role.title).join(', ') : 'None'}</td>
                </tr>
                <tr>
                  <td>Teaching Assignments</td>
                  <td>{teachingAssignments.length > 0 ? teachingAssignments.map(assign => assign.course.course_title).join(', ') : 'None'}</td>
                </tr>
                <tr>
                  <td>Hired Date</td>
                  <td>{instructor.hire_date}</td>
                </tr>
              </tbody>
            </table>
            <div className="instructor-info-footer">
              <button className="btn btn-danger" onClick={handleDelete}>Remove this instructor</button>
              <button className="btn btn-secondary" onClick={() => router.push('/instructor/Instructor')}>Back</button>
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

export default InstructorDetail;
