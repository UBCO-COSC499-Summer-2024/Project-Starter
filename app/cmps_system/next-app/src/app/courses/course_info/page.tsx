'use client';

import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import NavBar from '@/app/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import supabase from "@/app/components/supabaseClient";

const CourseInfo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [tas, setTas] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [editCourseMode, setEditCourseMode] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userRole, setUserRole] = useState('');

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
          setUserRole(data.role);
        }
      }
    }

    if (id) {
      const fetchCourseData = async () => {
        try {
          const { data: courseData, error: courseError } = await supabase
            .from('course')
            .select('*')
            .eq('course_id', id)
            .single();

          if (courseError) throw courseError;
          setCourse(courseData);

          const { data: assigneeData, error: assigneeError } = await supabase
            .from('v_course_info_assignees')
            .select('*')
            .eq('course_id', id);

          if (assigneeError) throw assigneeError;

          setInstructors(assigneeData.filter(assignee => assignee.position === 'Instructor'));
          setTas(assigneeData.filter(assignee => assignee.position === 'TA'));

        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUserRole();
      fetchCourseData();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('course')
        .delete()
        .eq('course_id', id);
      if (error) throw error;
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
        .eq('course_id', id);

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

  const openDeleteConfirm = () => {
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
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

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <h1>Course Info: {toTitleCase(course.course_title)}</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching course: {error}</p>
        ) : course ? (
          <>
            <TableContainer style={{ marginBottom: '20px' }}>
              <Table>
                <TableBody>
                  {Object.entries(course).map(([field, value]) => (
                    <TableRow key={field}>
                      <TableCell>{toTitleCase(field.replace(/_/g, ' '))}</TableCell>
                      <TableCell>
                        {editCourseMode[field] ? (
                          <TextField
                            value={value || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, () => handleSave(field, e.target.value))}
                          />
                        ) : (
                          value !== null ? value.toString() : 'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        {['staff', 'head'].includes(userRole.toLowerCase()) && (
                          <IconButton onClick={() => editCourseMode[field] ? handleSave(field, course[field]) : handleCourseEdit(field)}>
                            {editCourseMode[field] ? <SaveIcon /> : <EditIcon />}
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <h3>Assigned Instructors</h3>
            <TableContainer style={{ marginBottom: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Instructor Name</TableCell>
                    <TableCell>Position</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instructors.map((instructor) => (
                    <TableRow key={instructor.assignment_id}>
                      <TableCell>{instructor.instructor_name}</TableCell>
                      <TableCell>{instructor.position}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <h3>Assigned TAs</h3>
            <TableContainer style={{ marginBottom: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>TA Name</TableCell>
                    <TableCell>Position</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tas.map((ta) => (
                    <TableRow key={ta.assignment_id}>
                      <TableCell>{ta.instructor_name}</TableCell>
                      <TableCell>{ta.position}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {['staff', 'head'].includes(userRole.toLowerCase()) && (
              <Button variant="contained" color="secondary" onClick={openDeleteConfirm}>Remove this course</Button>
            )}
            <Button variant="contained" color="primary" onClick={() => router.push('/courses')}>Back</Button>
          </>
        ) : (
          <p>Course not found</p>
        )}
      </Container>

      <Modal open={deleteConfirmOpen} onClose={closeDeleteConfirm}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'white',
          padding: '16px',
          boxShadow: 24,
          p: 4,
        }}>
          <h2>Confirm Delete</h2>
          <p>Do you really want to remove this course? Any entries that reference this course will be deleted as well.</p>
          <Button variant="contained" color="secondary" onClick={closeDeleteConfirm}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CourseInfo;
