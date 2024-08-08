'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [serviceRoleModalShow, setServiceRoleModalShow] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchType, setSearchType] = useState('');
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [serviceRoleAssignments, setServiceRoleAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState('Instructor');
  const [selectedServiceRole, setSelectedServiceRole] = useState('');
  const [selectedServiceRoleId, setSelectedServiceRoleId] = useState(null);
  const [expectedHours, setExpectedHours] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [editableFields] = useState(['prefix', 'first_name', 'last_name', 'ubc_employee_num', 'title', 'hire_date', 'suffix']); // Define editable fields here

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
      setSelectedCourse(selected.name);
      setSelectedCourseId(selected.id);
    } else if (searchType === 'service_role') {
      setSelectedServiceRole(selected.name);
      setSelectedServiceRoleId(selected.id);
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

  const handleServiceRoleAssignmentSave = async () => {
    try {
      const { error } = await supabase
        .from('service_role_assign')
        .insert({
          instructor_id: instructorId,
          service_role_id: selectedServiceRoleId,
          expected_hours: expectedHours,
          start_date: startDate,
          end_date: endDate
        });

      if (error) throw error;

      // Fetch the updated list of service role assignments
      const { data: serviceRoleAssignmentsData, error: fetchError } = await supabase
        .from('v_service_role_assign')
        .select('*')
        .eq('instructor_id', instructorId);

      if (fetchError) throw fetchError;

      setServiceRoleAssignments(serviceRoleAssignmentsData);
      setServiceRoleModalShow(false);
      setSelectedServiceRole('');
      setSelectedServiceRoleId(null);
      setExpectedHours('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleServiceRoleEditSave = async (assignmentId) => {
    const assignment = serviceRoleAssignments.find(a => a.service_role_assign_id === assignmentId);
    try {
      const { error } = await supabase
        .from('service_role_assign')
        .update({
          expected_hours: assignment.expected_hours,
          start_date: assignment.start_date,
          end_date: assignment.end_date
        })
        .eq('service_role_assign_id', assignmentId);

      if (error) throw error;

      // Fetch the updated list of service role assignments
      const { data: serviceRoleAssignmentsData, error: fetchError } = await supabase
        .from('v_service_role_assign')
        .select('*')
        .eq('instructor_id', instructorId);

      if (fetchError) throw fetchError;

      setServiceRoleAssignments(serviceRoleAssignmentsData);
      setEditMode((prevState) => ({
        ...prevState,
        [`expected_hours_${assignmentId}`]: false,
        [`start_date_${assignmentId}`]: false,
        [`end_date_${assignmentId}`]: false
      }));
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

  const handleEdit = (field) => {
    setEditMode((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  const handleSave = async (field, value) => {
    try {
      const { error } = await supabase
        .from('instructor')
        .update({ [field]: value })
        .eq('instructor_id', instructorId);

      if (error) throw error;
      setInstructor((prevInstructor) => ({ ...prevInstructor, [field]: value }));
      setEditMode((prevState) => ({ ...prevState, [field]: false }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (field, value) => {
    setInstructor((prevInstructor) => ({ ...prevInstructor, [field]: value }));
  };

  const renderField = (field, value) => {
    if (field === 'prefix') {
      return (
        <Form.Select value={value || ''} onChange={(e) => handleChange(field, e.target.value)} size="sm">
          <option value="Mr.">Mr.</option>
          <option value="Mrs.">Mrs.</option>
          <option value="Ms.">Ms.</option>
          <option value="Dr.">Dr.</option>
          <option value="Prof.">Prof.</option>
        </Form.Select>
      );
    } else if (field === 'suffix') {
      return (
        <Form.Select value={value || ''} onChange={(e) => handleChange(field, e.target.value)} size="sm">
          <option value="">None</option>
          <option value="Jr.">Jr.</option>
          <option value="Sr.">Sr.</option>
          <option value="II">II</option>
          <option value="III">III</option>
          <option value="IV">IV</option>
        </Form.Select>
      );
    } else {
      const type = field === 'hire_date' ? 'date' : 'text';
      return (
        <Form.Control
          type={type}
          value={value || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          size="sm"
        />
      );
    }
  };

  const handlePositionChange = async (assignmentId, position) => {
    try {
      const { error } = await supabase
        .from('course_assign')
        .update({ position })
        .eq('assignment_id', assignmentId);

      if (error) throw error;

      // Fetch the updated list of course assignments
      const { data: courseAssignmentsData, error: fetchError } = await supabase
        .from('v_course_info_assignees')
        .select('*')
        .eq('instructor_id', instructorId);

      if (fetchError) throw fetchError;

      setCourseAssignments(courseAssignmentsData);
    } catch (error) {
      setError(error.message);
    }
  };

  const renderServiceRoleField = (field, value, assignmentId) => {
    return (
      <Form.Control
        type={field === 'expected_hours' ? 'number' : 'date'}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          setServiceRoleAssignments(prevAssignments =>
            prevAssignments.map(assignment =>
              assignment.service_role_assign_id === assignmentId ? { ...assignment, [field]: newValue } : assignment
            )
          );
        }}
        size="sm"
      />
    );
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
                {Object.entries(instructor).map(([field, value]) => (
                  field !== 'instructor_id' && (
                    <tr key={field}>
                      <td style={{ width: '30%' }}>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                      <td>{editMode[field] ? renderField(field, value) : (value !== null ? value.toString() : 'N/A')}</td>
                      <td style={{ width: '1px' }}>
                        {editableFields.includes(field) && ['head', 'staff'].includes(userRole) && (
                          <IconButton onClick={() => editMode[field] ? handleSave(field, instructor[field]) : handleEdit(field)} size="small">
                            {editMode[field] ? <SaveIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  )
                ))}
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
                    <td>
                      <a href={`/courses/course_info?id=${assignment.course_id}`}>{assignment.full_course_name}</a>
                    </td>
                    <td>
                      {editMode[`position_${assignment.assignment_id}`] ? (
                        <Form.Select
                          value={assignment.position}
                          onChange={(e) => handlePositionChange(assignment.assignment_id, e.target.value)}
                          size="sm"
                        >
                          <option value="Instructor">Instructor</option>
                          <option value="TA">TA</option>
                        </Form.Select>
                      ) : (
                        assignment.position
                      )}
                    </td>
                    <td>
                      {['head', 'staff'].includes(userRole) && (
                        <>
                          <IconButton onClick={() => setEditMode((prevState) => ({
                            ...prevState,
                            [`position_${assignment.assignment_id}`]: !prevState[`position_${assignment.assignment_id}`]
                          }))} size="small">
                            {editMode[`position_${assignment.assignment_id}`] ? <SaveIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                          </IconButton>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleAssigneeDelete(assignment.assignment_id, 'course')}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>

                    <td colSpan={3}></td>
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
                {serviceRoleAssignments.map((assignment) => (
                  <tr key={assignment.service_role_assign_id}>
                    <td>
                      <a href={`/service_roles/service_role_info?id=${assignment.service_role_id}`}>{assignment.service_role_title}</a>
                    </td>
                    <td>
                      {editMode[`expected_hours_${assignment.service_role_assign_id}`] ? (
                        renderServiceRoleField('expected_hours', assignment.expected_hours, assignment.service_role_assign_id)
                      ) : (
                        assignment.expected_hours
                      )}
                    </td>
                    <td>
                      {editMode[`start_date_${assignment.service_role_assign_id}`] ? (
                        renderServiceRoleField('start_date', assignment.start_date, assignment.service_role_assign_id)
                      ) : (
                        assignment.start_date
                      )}
                    </td>
                    <td>
                      {editMode[`end_date_${assignment.service_role_assign_id}`] ? (
                        renderServiceRoleField('end_date', assignment.end_date, assignment.service_role_assign_id)
                      ) : (
                        assignment.end_date
                      )}
                    </td>
                    <td>
                      {['head', 'staff'].includes(userRole) && (
                        <>
                          {editMode[`expected_hours_${assignment.service_role_assign_id}`] ||
                            editMode[`start_date_${assignment.service_role_assign_id}`] ||
                            editMode[`end_date_${assignment.service_role_assign_id}`] ? (
                            <IconButton onClick={() => handleServiceRoleEditSave(assignment.service_role_assign_id)} size="small">
                              <SaveIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton onClick={() => setEditMode((prevState) => ({
                              ...prevState,
                              [`expected_hours_${assignment.service_role_assign_id}`]: true,
                              [`start_date_${assignment.service_role_assign_id}`]: true,
                              [`end_date_${assignment.service_role_assign_id}`]: true
                            }))} size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleAssigneeDelete(assignment.service_role_assign_id, 'service_role')}
                          >
                            Delete
                          </Button>
                        </>
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
                onClick={() => setServiceRoleModalShow(true)}
              >
                ➕ Assign New Service Role
              </Button>
            )}

            <div className="instructor-info-footer">
              {['head', 'staff'].includes(userRole) && (
                <Button className="btn btn-danger" onClick={handleDelete}>Remove this instructor</Button>
              )}
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
              <Button variant="outline-secondary" onClick={() => { setSearchType('course'); setSearchModalOpen(true); }} className="w-100 mt-2">
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

      <Modal show={serviceRoleModalShow} onHide={() => setServiceRoleModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign New Service Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectServiceRole">
              <Form.Label>Select Service Role</Form.Label>
              <Button variant="outline-secondary" onClick={() => { setSearchType('service_role'); setSearchModalOpen(true); }} className="w-100 mt-2">
                {selectedServiceRole || "Select a service role"}
              </Button>
            </Form.Group>
            <Form.Group controlId="expectedHours" className="mt-3">
              <Form.Label>Expected Monthly Hours</Form.Label>
              <Form.Control
                type="number"
                value={expectedHours}
                onChange={(e) => setExpectedHours(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="startDate" className="mt-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="endDate" className="mt-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setServiceRoleModalShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleServiceRoleAssignmentSave} disabled={!selectedServiceRoleId || !expectedHours || !startDate || !endDate}>
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
