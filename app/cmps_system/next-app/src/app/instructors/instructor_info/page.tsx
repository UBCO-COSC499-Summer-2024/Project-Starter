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
import supabase from "@/app/components/supabaseClient";
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
  const [selectedServiceRole, setSelectedServiceRole] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseAssignments, setCourseAssignments] = useState([]);

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
            .from('service_role')
            .select('*');

          if (serviceRoleError) throw serviceRoleError;
          setServiceRoles(serviceRoleData);

          const { data: assignedRoleData, error: assignedRoleError } = await supabase
            .from('v_service_role_assign')
            .select('service_role_id')
            .eq('instructor_id', id)
            .single();

          if (assignedRoleError) throw assignedRoleError;
          setSelectedServiceRole(assignedRoleData.service_role_id);

          const { data: courseData, error: courseError } = await supabase
            .from('course')
            .select('*');

          if (courseError) throw courseError;
          setCourses(courseData);

          const { data: assignedCoursesData, error: assignedCoursesError } = await supabase
            .from('course_assign')
            .select('*')
            .eq('instructor_id', id);

          if (assignedCoursesError) throw assignedCoursesError;
          setCourseAssignments(assignedCoursesData);

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

  const handleServiceRoleChange = async (e) => {
    const newServiceRoleId = e.target.value;
    setSelectedServiceRole(newServiceRoleId);

    try {
      const { data: existingAssignment, error: fetchError } = await supabase
        .from('v_service_role_assign')
        .select('*')
        .eq('instructor_id', id)
        .single();

      if (fetchError) throw fetchError;

      if (existingAssignment) {
        const { error: updateError } = await supabase
          .from('service_role_assign')
          .update({ service_role_id: newServiceRoleId })
          .eq('instructor_id', id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('service_role_assign')
          .insert({
            instructor_id: id,
            service_role_id: newServiceRoleId,
            start_date: new Date().toISOString().split('T')[0],
            end_date: null,
            expected_hours: 0,
          });

        if (insertError) throw insertError;
      }

      alert('Service role updated successfully');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCourseChange = async (e, assignmentId) => {
    const newCourseId = e.target.value;

    try {
      const { error: updateError } = await supabase
        .from('course_assign')
        .update({ course_id: newCourseId })
        .eq('assignment_id', assignmentId);

      if (updateError) throw updateError;

      setCourseAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.assignment_id === assignmentId
            ? { ...assignment, course_id: newCourseId }
            : assignment
        )
      );

      alert('Course assignment updated successfully');
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
                <tr>
                  <td>Service Role</td>
                  <td>
                    <Form.Select
                      value={selectedServiceRole}
                      onChange={handleServiceRoleChange}
                    >
                      {serviceRoles.map((role) => (
                        <option key={role.service_role_id} value={role.service_role_id}>
                          {role.title}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
                {courseAssignments.map((assignment) => (
                  <React.Fragment key={assignment.assignment_id}>
                    <tr>
                      <td>Teaching Assignment</td>
                      <td>
                        <Form.Select
                          value={assignment.course_id}
                          onChange={(e) => handleCourseChange(e, assignment.assignment_id)}
                        >
                          {courses.map((course) => (
                            <option key={course.course_id} value={course.course_id}>
                              {course.course_title}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
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
