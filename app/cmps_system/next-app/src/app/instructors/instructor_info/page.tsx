'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);

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
  const [serviceRoles, setServiceRoles] = useState([]);
  const [serviceRoleAssignments, setServiceRoleAssignments] = useState([]);
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [endDate, setEndDate] = useState('');
  const [showNewServiceRole, setShowNewServiceRole] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const [{ data: instructorData, error: instructorError },
            { data: serviceRoleData, error: serviceRoleError },
            { data: assignedRoleData, error: assignedRoleError },
            { data: assignedCoursesData, error: assignedCoursesError }] = await Promise.all([
              supabase.from('instructor').select('*').eq('instructor_id', id).single(),
              supabase.from('service_role').select('*'),
              supabase.from('service_role_assign').select('*').eq('instructor_id', id),
              supabase.from('course_assign').select('*').eq('instructor_id', id)
            ]);

          if (instructorError) throw instructorError;
          if (serviceRoleError) throw serviceRoleError;
          if (assignedRoleError) throw assignedRoleError;
          if (assignedCoursesError) throw assignedCoursesError;

          setInstructor(instructorData);
          setServiceRoles(serviceRoleData);
          setServiceRoleAssignments(assignedRoleData);
          setCourseAssignments(assignedCoursesData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
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

  const handleServiceRoleChange = (e, assignmentId) => {
    const newServiceRoleId = e.target.value;
    if (serviceRoleAssignments.some((assignment) => assignment.service_role_id === parseInt(newServiceRoleId, 10))) {
      alert('This service role is already assigned to the instructor.');
      return;
    }
    setSelectedAssignment({ type: 'service_role', newId: newServiceRoleId, assignmentId });
    setModalShow(true);
  };

  const handleSave = async () => {
    try {
      const { newId, assignmentId } = selectedAssignment;
      const dataToSave = {
        service_role_id: newId,
        end_date: endDate
      };

      if (assignmentId) {
        const { error } = await supabase
          .from('service_role_assign')
          .update(dataToSave)
          .eq('service_role_assign_id', assignmentId);

        if (error) throw error;

        setServiceRoleAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.service_role_assign_id === assignmentId
              ? { ...assignment, ...dataToSave }
              : assignment
          )
        );
      } else {
        const { data, error } = await supabase
          .from('service_role_assign')
          .insert({
            ...dataToSave,
            instructor_id: id,
            start_date: new Date().toISOString().split('T')[0],
            expected_hours: 0,
          })
          .select('*');  // Explicitly select the inserted data

        if (error) throw error;

        if (data && data.length > 0) {
          setServiceRoleAssignments((prevAssignments) => [...prevAssignments, data[0]]);
          setShowNewServiceRole(false);  // Reset showNewServiceRole
        }
      }

      alert('Service role assignment updated successfully');
      setModalShow(false);
      setEndDate('');
    } catch (error) {
      console.error('Save Error:', error);
      setError(error.message);
    }
  };

  const handleNewServiceRole = () => {
    setShowNewServiceRole(true);
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

            <h3>Service Role Assignments</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Service Role</th>
                  <th>Expected Hours</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {serviceRoleAssignments.map((assignment, index) => (
                  <tr key={assignment.service_role_assign_id || index}>
                    <td>
                      <Form.Select
                        value={assignment.service_role_id}
                        onChange={(e) => handleServiceRoleChange(e, assignment.service_role_assign_id)}
                      >
                        <option value="">Select a service role</option>
                        {serviceRoles.map((role) => (
                          <option key={role.service_role_id} value={role.service_role_id}>
                            {role.title}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>{assignment.expected_hours}</td>
                    <td>{assignment.start_date}</td>
                    <td>{assignment.end_date}</td>
                  </tr>
                ))}
                {showNewServiceRole && (
                  <tr>
                    <td>
                      <Form.Select onChange={(e) => handleServiceRoleChange(e, null)}>
                        <option value="">Select a service role</option>
                        {serviceRoles.map((role) => (
                          <option key={role.service_role_id} value={role.service_role_id}>
                            {role.title}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td colSpan="3"></td>
                  </tr>
                )}
              </tbody>
            </table>
            <Button className="btn btn-primary mb-3" onClick={handleNewServiceRole}>
              Assign New Service Role
            </Button>

            <h3>Teaching Assignments</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {courseAssignments.map((assignment, index) => (
                  <tr key={assignment.assignment_id || index}>
                    <td>{assignment.course_id}</td>
                    <td>{assignment.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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
          <Modal.Title>Enter End Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!endDate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InstructorInfo;
