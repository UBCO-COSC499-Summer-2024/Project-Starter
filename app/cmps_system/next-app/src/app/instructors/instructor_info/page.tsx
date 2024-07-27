'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
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
  const [courseModalShow, setCourseModalShow] = useState(false);
  const [serviceRoles, setServiceRoles] = useState([]);
  const [serviceRoleAssignments, setServiceRoleAssignments] = useState([]);
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('Instructor');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [endDate, setEndDate] = useState('');
  const [showNewServiceRole, setShowNewServiceRole] = useState(false);
  const [filters, setFilters] = useState({
    academic_year: '',
    session: '',
    term: '',
    subject_code: '',
    course_num: ''
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const [{ data: instructorData, error: instructorError },
            { data: serviceRoleData, error: serviceRoleError },
            { data: assignedRoleData, error: assignedRoleError },
            { data: assignedCoursesData, error: assignedCoursesError },
            { data: coursesData, error: coursesError }] = await Promise.all([
              supabase.from('instructor').select('*').eq('instructor_id', id).single(),
              supabase.from('service_role').select('*'),
              supabase.from('service_role_assign').select('*').eq('instructor_id', id),
              supabase.from('v_teaching_assignments').select('*').eq('instructor_id', id),
              supabase.from('v_courses_with_instructors').select('*')
            ]);

          if (instructorError) throw instructorError;
          if (serviceRoleError) throw serviceRoleError;
          if (assignedRoleError) throw assignedRoleError;
          if (assignedCoursesError) throw assignedCoursesError;
          if (coursesError) throw coursesError;

          setInstructor(instructorData);
          setServiceRoles(serviceRoleData);
          setServiceRoleAssignments(assignedRoleData);
          setCourseAssignments(assignedCoursesData);
          setCourses(coursesData);
          setFilteredCourses(coursesData);
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

  const handleNewCourseAssignment = () => {
    setCourseModalShow(true);
  };

  const handleCourseAssignmentSave = async () => {
    try {
      const { data, error } = await supabase
        .from('course_assign')
        .insert({
          instructor_id: id,
          course_id: selectedCourse,
          position: selectedPosition,
          start_date: new Date().toISOString().split('T')[0]
        })
        .select('*');  // Explicitly select the inserted data

      if (error) throw error;

      if (data && data.length > 0) {
        setCourseAssignments((prevAssignments) => [...prevAssignments, data[0]]);
        setCourseModalShow(false);  // Reset course modal
        setSelectedCourse('');
        setSelectedPosition('Instructor');
      }

      alert('Course assignment added successfully');
    } catch (error) {
      console.error('Save Error:', error);
      setError(error.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    applyFilters({ ...filters, [name]: value });
  };

  const applyFilters = (filterValues) => {
    setFilteredCourses(courses.filter(course => {
      return Object.keys(filterValues).every(key =>
        !filterValues[key] || course[key]?.toString().toLowerCase().includes(filterValues[key].toLowerCase())
      );
    }));
  };

  const handleRowClick = (courseId) => {
    setSelectedCourse(courseId);
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
                  <tr key={assignment.id || index}>
                    <td>{assignment.full_course_name}</td>
                    <td>{assignment.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button className="btn btn-primary mb-3" onClick={handleNewCourseAssignment}>
              Assign New Teaching Assignment
            </Button>

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

      <Modal show={courseModalShow} onHide={() => setCourseModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign New Teaching Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <fieldset style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            <legend style={{ paddingLeft: '5px', paddingRight: '5px' }}>Filter Options</legend>
            <div className="d-flex justify-content-between">
              <div>
                <Form.Group controlId="filterAcademicYear">
                  <Form.Label>Academic Year</Form.Label>
                  <Form.Control type="text" placeholder="Academic Year" name="academic_year" value={filters.academic_year} onChange={handleFilterChange} />
                </Form.Group>
                <Form.Group controlId="filterSession">
                  <Form.Label>Session</Form.Label>
                  <Form.Control type="text" placeholder="Session" name="session" value={filters.session} onChange={handleFilterChange} />
                </Form.Group>
                <Form.Group controlId="filterTerm">
                  <Form.Label>Term</Form.Label>
                  <Form.Control type="text" placeholder="Term" name="term" value={filters.term} onChange={handleFilterChange} />
                </Form.Group>
                <Form.Group controlId="filterSubjectCode">
                  <Form.Label>Subject Code</Form.Label>
                  <Form.Control type="text" placeholder="Subject Code" name="subject_code" value={filters.subject_code} onChange={handleFilterChange} />
                </Form.Group>
                <Form.Group controlId="filterCourseNum">
                  <Form.Label>Course Number</Form.Label>
                  <Form.Control type="text" placeholder="Course Number" name="course_num" value={filters.course_num} onChange={handleFilterChange} />
                </Form.Group>
              </div>
              <div className="ml-3">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Course</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr
                        key={course.course_id}
                        onClick={() => handleRowClick(course.course_id)}
                        className={selectedCourse === course.course_id ? "table-primary" : ""}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{course.full_course_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </fieldset>
          <Form.Group controlId="selectPosition">
            <Form.Label>Position</Form.Label>
            <Form.Select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
              <option value="Instructor">Instructor</option>
              <option value="TA">TA</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCourseModalShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCourseAssignmentSave} disabled={!selectedCourse || !selectedPosition}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InstructorInfo;
