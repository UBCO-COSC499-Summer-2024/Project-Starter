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
        setError('No course ID provided');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase.from('course').select('*').eq('course_id', courseId).single();
        if (error) {
          setError(error.message);
          console.error('Error fetching course:', error);
        } else {
          const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
            if (key !== 'course_id') { 
              acc.push({
                id: key,
                field: key,
                label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: value
              });
            }
            return acc;
          }, []);
          setCourse(filteredData);
        }
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleProcessRowUpdate = async (newRow) => {
    try {
      const updatedCourseData = { ...course.find(row => row.id === newRow.id), ...newRow };
      const { error } = await supabase
        .from('course')
        .update({ [newRow.field]: newRow.value })
        .eq('course_id', courseId);

      if (error) {
        throw new Error(error.message);
      }

      setCourse(course.map(row => (row.id === newRow.id ? updatedCourseData : row)));
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
    { field: 'value', headerName: 'Value', width: 500, editable: true }
  ];

  return (
    <div>
      <NavBar />
      <Container fluid className="banner">
        <h2>Course Info</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
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
