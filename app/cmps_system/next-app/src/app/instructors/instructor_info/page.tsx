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
  const [courses, setCourses] = useState([]);
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [endDate, setEndDate] = useState('');
  const [showNewServiceRole, setShowNewServiceRole] = useState(false);
  const [showNewCourseAssignment, setShowNewCourseAssignment] = useState(false);

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
            .from('service_role_assign')
            .select('*')
            .eq('instructor_id', id);

          if (assignedRoleError) throw assignedRoleError;
          setServiceRoleAssignments(assignedRoleData);

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

  const handleServiceRoleChange = (e, assignmentId) => {
    const newServiceRoleId = e.target.value;
    if (serviceRoleAssignments.some((assignment) => assignment.service_role_id === parseInt(newServiceRoleId, 10))) {
      alert('This service role is already assigned to the instructor.');
      return;
    }
    setSelectedAssignment({ type: 'service_role', newId: newServiceRoleId, assignmentId });
    setModalShow(true);
  };

  const handleCourseChange = (e, assignmentId) => {
    const newCourseId = e.target.value;
    if (courseAssignments.some((assignment) => assignment.course_id === parseInt(newCourseId, 10))) {
      alert('This course is already assigned to the instructor.');
      return;
    }
    setSelectedAssignment({ type: 'course', newId: newCourseId, assignmentId });
    setModalShow(true);
  };

  const handleSave = async () => {
    try {
      if (selectedAssignment.type === 'service_role') {
        const { newId, assignmentId } = selectedAssignment;
        if (assignmentId) {
          const { error: updateError } = await supabase
            .from('service_role_assign')
            .update({ service_role_id: newId, end_date: endDate })
            .eq('service_role_assign_id', assignmentId);

          if (updateError) throw updateError;

          setServiceRoleAssignments((prevAssignments) =>
            prevAssignments.map((assignment) =>
              assignment.service_role_assign_id === assignmentId
                ? { ...assignment, service_role_id: newId, end_date: endDate }
                : assignment
            )
          );
        } else {
          const { data, error: insertError } = await supabase
            .from('service_role_assign')
            .insert({
              instructor_id: id,
              service_role_id: newId,
              start_date: new Date().toISOString().split('T')[0],
              end_date: endDate,
              expected_hours: 0,
            })
            .select('*');  // Explicitly select the inserted data

          if (insertError) throw insertError;

          if (data && data.length > 0) {
            setServiceRoleAssignments((prevAssignments) => [...prevAssignments, data[0]]);
          }
        }
      } else if (selectedAssignment.type === 'course') {
        const { newId, assignmentId } = selectedAssignment;
        if (assignmentId) {
          const { error: updateError } = await supabase
            .from('course_assign')
            .update({ course_id: newId, end_date: endDate })
            .eq('assignment_id', assignmentId);

          if (updateError) throw updateError;

          setCourseAssignments((prevAssignments) =>
            prevAssignments.map((assignment) =>
              assignment.assignment_id === assignmentId
                ? { ...assignment, course_id: newId, end_date: endDate }
                : assignment
            )
          );
        } else {
          const { data, error: insertError } = await supabase
            .from('course_assign')
            .insert({
              instructor_id: id,
              course_id: newId,
              position: 'Teaching',
              start_date: new Date().toISOString().split('T')[0],
              end_date: endDate,
            })
            .select('*');  // Explicitly select the inserted data

          if (insertError) throw insertError;

          if (data && data.length > 0) {
            setCourseAssignments((prevAssignments) => [...prevAssignments, data[0]]);
          }
        }
      }

      alert(`${selectedAssignment.type === 'service_role' ? 'Service role' : 'Course'} assignment updated successfully`);
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

  const handleNewCourseAssignment = () => {
    setShowNewCourseAssignment(true);
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
                {serviceRoleAssignments.map((assignment, index) => (
                  <React.Fragment key={assignment.service_role_assign_id || index}>
                    <tr>
                      <td>Service Role</td>
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
                    </tr>
                  </React.Fragment>
                ))}
                {showNewServiceRole && (
                  <tr>
                    <td>Service Role</td>
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
                  </tr>
                )}
                {courseAssignments.map((assignment, index) => (
                  <React.Fragment key={assignment.assignment_id || index}>
                    <tr>
                      <td>Teaching Assignment</td>
                      <td>
                        <Form.Select
                          value={assignment.course_id}
                          onChange={(e) => handleCourseChange(e, assignment.assignment_id)}
                        >
                          <option value="">Select a course</option>
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
                {showNewCourseAssignment && (
                  <tr>
                    <td>Teaching Assignment</td>
                    <td>
                      <Form.Select onChange={(e) => handleCourseChange(e, null)}>
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                          <option key={course.course_id} value={course.course_id}>
                            {course.course_title}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="instructor-info-footer">
              <button className="btn btn-danger" onClick={handleDelete}>Remove this instructor</button>
              <button className="btn btn-secondary" onClick={() => router.push('/instructors')}>Back</button>
              <button className="btn btn-primary" onClick={handleNewServiceRole}>Assign New Service Role</button>
              <button className="btn btn-primary" onClick={handleNewCourseAssignment}>Assign New Teaching Assignment</button>
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
