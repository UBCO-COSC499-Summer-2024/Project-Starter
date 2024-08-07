'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import supabase from "@/app/components/supabaseClient";
import SearchModal from "@/app/components/SearchModal"; // Adjust the path as needed

const InstructorInfo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const instructorId = searchParams.get('id');

  const [instructor, setInstructor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [courseModalShow, setCourseModalShow] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchType, setSearchType] = useState('');
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [serviceRoleAssignments, setServiceRoleAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState('Instructor');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchUserRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_role')
          .select('role')
          .eq('user_id', user.id)
          .single();
        if (error) {
          console.error('Error fetching user role:', error);
        } else {
          setUserRole(data.role); // Set userRole state
        }
      }
    }

    const fetchData = async () => {
      try {
        const [{ data: instructorData, error: instructorError },
          { data: courseAssignmentsData, error: courseAssignmentsError },
          { data: serviceRoleAssignmentsData, error: serviceRoleAssignmentsError }] = await Promise.all([
            supabase.from('instructor').select('*').eq('instructor_id', instructorId).single(),
            supabase.from('v_course_info_assignees').select('*').eq('instructor_id', instructorId),
            supabase.from('v_service_role_assign').select('*').eq('instructor_id', instructorId),
          ]);

        if (instructorError) throw instructorError;
        if (courseAssignmentsError) throw courseAssignmentsError;
        if (serviceRoleAssignmentsError) throw serviceRoleAssignmentsError;

        setInstructor(instructorData);
        setCourseAssignments(courseAssignmentsData);
        setServiceRoleAssignments(serviceRoleAssignmentsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
    if (instructorId) {
      fetchData();
    }
  }, [instructorId]);

  const handleDelete = async () => {
    setModalShow(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('instructor')
        .delete()
        .eq('instructor_id', instructorId);
      if (error) throw error;
      alert('Instructor removed successfully');
      router.push('/instructors');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearchModalSelect = (selected) => {
    if (searchType === 'course') {
      setSelectedCourse(selected.full_course_name);
      setSelectedCourseId(selected.id);
    }
    setSearchModalOpen(false);
  };

  const handleCourseAssignmentSave = async () => {
    try {
      const { error } = await supabase
        .from('course_assign')
        .insert({
          instructor_id: instructorId,
          course_id: selectedCourseId,
          position: selectedPosition
        });

      if (error) throw error;

      // Fetch the updated list of course assignments
      const { data: courseAssignmentsData, error: fetchError } = await supabase
        .from('v_course_info_assignees')
        .select('*')
        .eq('instructor_id', instructorId);

      if (fetchError) throw fetchError;

      setCourseAssignments(courseAssignmentsData);
      setCourseModalShow(false);
      setSelectedCourse('');
      setSelectedCourseId(null);
      setSelectedPosition('Instructor');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAssigneeDelete = async (assignmentId, type) => {
    try {
      const table = type === 'course' ? 'course_assign' : 'service_role_assign';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq(type === 'course' ? 'assignment_id' : 'service_role_assign_id', assignmentId);

      if (error) throw error;

      if (type === 'course') {
        setCourseAssignments(courseAssignments.filter(assignment => assignment.assignment_id !== assignmentId));
      } else {
        setServiceRoleAssignments(serviceRoleAssignments.filter(assignment => assignment.service_role_assign_id !== assignmentId));
      }
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
            <Table className="table table-bordered">
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
                  <td>Email</td>
                  <td>{instructor.email}</td>
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
            </Table>

            <h3>Teaching Assignments</h3>
            <Table className="table table-bordered">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courseAssignments.map((assignment) => (
                  <tr key={assignment.assignment_id}>
                    <td>{assignment.full_course_name}</td>
                    <td>{assignment.position}</td>
                    <td>
                      {['head', 'staff'].includes(userRole) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleAssigneeDelete(assignment.assignment_id, 'course')}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {['head', 'staff'].includes(userRole) && (
              <Button
                variant="primary"
                className="mb-3"
                onClick={() => setCourseModalShow(true)}
              >
                ➕ Assign New Course
              </Button>
            )}

            <h3>Service Role Assignments</h3>
            <Table className="table table-bordered">
              <thead>
                <tr>
                  <th>Service Role</th>
                  <th>Expected Hours</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceRoleAssignments.map((role) => (
                  <tr key={role.service_role_assign_id}>
                    <td>{role.service_role_title}</td>
                    <td>{role.expected_hours}</td>
                    <td>{role.start_date}</td>
                    <td>{role.end_date}</td>
                    <td>
                      {['head', 'staff'].includes(userRole) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleAssigneeDelete(role.service_role_assign_id, 'service_role')}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {['head', 'staff'].includes(userRole) && (
              <Button
                variant="primary"
                className="mb-3"
                onClick={() => { setSearchType('service_role'); setSearchModalOpen(true); }}
              >
                ➕ Assign New Service Role
              </Button>
            )}

            <div className="instructor-info-footer">
              <Button className="btn btn-danger" onClick={handleDelete}>Remove this instructor</Button>
              <Button className="btn btn-secondary" onClick={() => router.push('/instructors')}>Back</Button>
            </div>
          </>
        ) : (
          <p>Instructor not found</p>
        )}
      </Container>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this instructor?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={courseModalShow} onHide={() => setCourseModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectCourse">
              <Form.Label>Select Course</Form.Label>
              <Button variant="outline-secondary" onClick={() => { setSearchType('course'); setSearchModalOpen(true); }}>
                {selectedCourse || "Select a course"}
              </Button>
            </Form.Group>
            <Form.Group controlId="selectPosition" className="mt-3">
              <Form.Label>Position</Form.Label>
              <Form.Select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
                <option value="Instructor">Instructor</option>
                <option value="TA">TA</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCourseModalShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCourseAssignmentSave} disabled={!selectedCourseId || !selectedPosition}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <SearchModal
        open={searchModalOpen}
        handleClose={() => setSearchModalOpen(false)}
        handleSelect={handleSearchModalSelect}
        type={searchType}
      />
    </div>
  );
};

export default InstructorInfo;
