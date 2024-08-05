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
import Form from 'react-bootstrap/Form';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import supabase from "@/app/components/supabaseClient";
import SearchModal from "@/app/components/SearchModal"; // Adjust the path as needed
import getUserType from "@/app/components/getUserType";

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
  const [editMode, setEditMode] = useState({});
  const [editCourseMode, setEditCourseMode] = useState({});
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchType, setSearchType] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [editableFields] = useState(['academic_year', 'session', 'term', 'subject_code', 'course_num', 'section_num', 'course_title', 'mode_of_delivery', 'req_in_person_attendance', 'building', 'room_num', 'section_comments', 'activity', 'days', 'start_time', 'end_time', 'num_students', 'num_tas', 'average_grade', 'credits', 'year_level', 'registration_status', 'status']); // Define editable fields here

  const fieldTypes = {
    academic_year: 'number',
    session: 'select',
    term: 'select',
    subject_code: 'text',
    course_num: 'text',
    section_num: 'text',
    course_title: 'text',
    mode_of_delivery: 'select',
    req_in_person_attendance: 'select',
    building: 'text',
    room_num: 'text',
    section_comments: 'text',
    activity: 'text',
    days: 'text',
    start_time: 'time',
    end_time: 'time',
    num_students: 'number',
    num_tas: 'number',
    average_grade: 'number',
    credits: 'number',
    year_level: 'number',
    registration_status: 'text',
    status: 'text'
  };

  useEffect(() => {
    const fetchData = async () => {
      if (courseId) {
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

          const role = await getUserType();
          setUserRole(role);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
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

  const handleEdit = (field) => {
    setEditMode((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  const handleCourseEdit = (field) => {
    setEditCourseMode((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  const handleSave = async (field, value) => {
    try {
      const { error } = await supabase
        .from('course')
        .update({ [field]: value })
        .eq('course_id', courseId);

      if (error) throw error;
      setCourse((prevCourse) => ({ ...prevCourse, [field]: value }));
      setEditCourseMode((prevState) => ({ ...prevState, [field]: false }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (field, value) => {
    setCourse((prevCourse) => ({ ...prevCourse, [field]: value }));
  };

  const handleSelect = async (selected) => {
    try {
      const position = searchType === 'instructor' ? 'Instructor' : 'TA';

      const { error } = await supabase
        .from('course_assign')
        .insert({
          instructor_id: selected.id,
          course_id: courseId,
          position: position
        });

      if (error) throw error;

      // Fetch the updated list of assignees
      const { data: assigneeData, error: fetchError } = await supabase
        .from('v_course_info_assignees')
        .select('*')
        .eq('course_id', courseId);

      if (fetchError) throw fetchError;

      setInstructors(assigneeData.filter(assignee => assignee.position === 'Instructor'));
      setTas(assigneeData.filter(assignee => assignee.position === 'TA'));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAssigneeDelete = async (assignmentId, type) => {
    try {
      const { error } = await supabase
        .from('course_assign')
        .delete()
        .eq('assignment_id', assignmentId);

      if (error) throw error;

      if (type === 'instructor') {
        setInstructors(instructors.filter(instructor => instructor.assignment_id !== assignmentId));
      } else {
        setTas(tas.filter(ta => ta.assignment_id !== assignmentId));
      }
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

  const handleKeyDown = (event, saveAction) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveAction();
    }
  };

  const renderField = (field, value) => {
    const type = fieldTypes[field];
    if (type === 'select') {
      if (field === 'session') {
        return (
          <Form.Select value={value || ''} onChange={(e) => handleChange(field, e.target.value)} size="sm">
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </Form.Select>
        );
      }
      if (field === 'term') {
        return (
          <Form.Select value={value || ''} onChange={(e) => handleChange(field, e.target.value)} size="sm">
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 1-2">Term 1-2</option>
          </Form.Select>
        );
      }
      if (field === 'mode_of_delivery') {
        return (
          <Form.Select value={value || ''} onChange={(e) => handleChange(field, e.target.value)} size="sm">
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Multi-access">Multi-access</option>
          </Form.Select>
        );
      }
      if (field === 'req_in_person_attendance') {
        return (
          <Form.Select value={value ? 'Yes' : 'No'} onChange={(e) => handleChange(field, e.target.value === 'Yes')} size="sm">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Select>
        );
      }
    } else if (type === 'time') {
      return (
        <Form.Control
          type="time"
          value={value || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          step="60" // Ensure minute resolution
          size="sm"
        />
      );
    } else if (type === 'number') {
      return (
        <Form.Control
          type="number"
          value={value || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          size="sm"
        />
      );
    } else {
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

  return (
    <div>
      <NavBar />
      <Container fluid className="banner">
        <h2>
          Course Info: {course.subject_code} {course.course_num} {course.section_num} - {course.academic_year}{course.session === 'Winter' ? 'W' : 'S'}{course.term ? course.term.replace('Term ', '') : ''}
        </h2>
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
                      <td>{editCourseMode[field] ? renderField(field, value) : (value !== null ? value.toString() : 'N/A')}</td>
                      <td style={{ width: '1px' }}>
                        {editableFields.includes(field) && ['head', 'staff'].includes(userRole) && (
                          <IconButton onClick={() => editCourseMode[field] ? handleSave(field, course[field]) : handleCourseEdit(field)} size="small">
                            {editCourseMode[field] ? <SaveIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                          </IconButton>
                        )}
                      </td>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((instructor) => (
                    <tr key={instructor.assignment_id}>
                      <td>{instructor.instructor_name}</td>
                      <td>{instructor.position}</td>
                      <td>
                        {['head', 'staff'].includes(userRole) && (
                          <IconButton onClick={() => handleAssigneeDelete(instructor.assignment_id, 'instructor')} size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {['head', 'staff'].includes(userRole) && (
                <Button
                  variant="primary"
                  className="my-3"
                  onClick={() => { setSearchType('instructor'); setSearchModalOpen(true); }}
                  style={{ width: '100%', backgroundColor: '#002145', color: 'white' }}
                >
                  ➕ Assign New Instructor
                </Button>
              )}
              <h3>Assigned TAs</h3>
              <Table className="table table-bordered">
                <thead>
                  <tr>
                    <th>TA Name</th>
                    <th>Position</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tas.map((ta) => (
                    <tr key={ta.assignment_id}>
                      <td>{ta.instructor_name}</td>
                      <td>{ta.position}</td>
                      <td>
                        {['head', 'staff'].includes(userRole) && (
                          <IconButton onClick={() => handleAssigneeDelete(ta.assignment_id, 'ta')} size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {['head', 'staff'].includes(userRole) && (
                <Button
                  variant="primary"
                  className="my-3"
                  onClick={() => { setSearchType('ta'); setSearchModalOpen(true); }}
                  style={{ width: '100%', backgroundColor: '#002145', color: 'white' }}
                >
                  ➕ Assign New TA
                </Button>
              )}
            </Col>
          </Row>
        ) : (
          <p>Course not found</p>
        )}
        <div className="course-info-footer">
          {['head', 'staff'].includes(userRole) && (
            <Button className="btn btn-danger" onClick={handleDelete}>Remove this course</Button>
          )}
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

      <SearchModal
        open={searchModalOpen}
        handleClose={() => setSearchModalOpen(false)}
        handleSelect={handleSelect}
        type="instructor" // Always use 'instructor' type for SearchModal
      />
    </div>
  );
};

export default CourseInfo;
