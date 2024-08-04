'use client';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import supabase from "@/app/components/supabaseClient";
import { useRouter } from 'next/navigation';

const CourseInfo = () => {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError('Course ID not found');
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('course')
          .select('*')
          .eq('course_id', courseId)
          .single();

        if (courseError) {
          throw courseError;
        }

        // Fetch assigned instructors with positions
        const { data: assignData, error: assignError } = await supabase
          .from('course_assign')
          .select('instructor_id, position')
          .eq('course_id', courseId);

        if (assignError) {
          throw assignError;
        }

        // Fetch instructor details
        const instructorIds = assignData.map(assign => assign.instructor_id);
        const { data: instructorData, error: instructorError } = await supabase
          .from('instructor')
          .select('instructor_id, first_name, last_name')
          .in('instructor_id', instructorIds);

        if (instructorError) {
          throw instructorError;
        }

        // Format course data
        const formattedCourseData = Object.entries(courseData).reduce((acc, [key, value]) => {
          if (key !== 'course_id') {
            let formattedValue = value;
            if (key === 'req_in_person_attendance') {
              formattedValue = value ? 'Yes' : 'No';
            }
            acc.push({
              id: key,
              field: key,
              label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              value: formattedValue
            });
          }
          return acc;
        }, []);

        // Add instructor names with positions to course data
        assignData.forEach((assign, index) => {
          const instructor = instructorData.find(inst => inst.instructor_id === assign.instructor_id);
          if (instructor) {
            formattedCourseData.push({
              id: `instructor_${index}`,
              field: `instructor_${index}`,
              label: `${assign.position}`,
              value: `${instructor.first_name} ${instructor.last_name}`
            });
          }
        });

        setCourse(formattedCourseData);
        setError(null);  // Clear any previous errors
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleProcessRowUpdate = async (newRow) => {
    try {
      const { error: updateError } = await supabase
        .from('course')
        .update({ [newRow.field]: newRow.value })
        .eq('course_id', courseId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setCourse(course.map(row => (row.id === newRow.id ? { ...row, value: newRow.value } : row)));
      return newRow;
    } catch (error) {
      setError(error.message);
      console.error('Update error:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('course')
        .delete()
        .eq('course_id', courseId);
      if (error) throw error;
      alert('Course removed successfully');
      router.push('/courses');
      setModalShow(false);
    } catch (error) {
      setError(error.message);
      console.error('Delete error:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'label', headerName: 'Attribute', width: 200, editable: false },
    { field: 'value', headerName: 'Value', width: 300, editable: true }
  ];

  return (
    <div>
      <NavBar />
      <Container fluid className="banner">
        <h2>Course Info</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching course: {error}</p>
        ) : (
          <DataGrid
            rows={course}
            columns={columns}
            processRowUpdate={handleProcessRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            autoHeight
          />
        )}
        <Button variant="danger" onClick={() => setModalShow(true)}>Remove this course</Button>
        <button className="btn btn-secondary" onClick={() => router.push('/courses')}>Back</button>
        <button className="btn btn-primary" onClick={() => router.push('/instructors')}>Assign a new insturctor/TA</button>
      </Container>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this course?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseInfo;
