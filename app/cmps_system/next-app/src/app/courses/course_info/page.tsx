'use client';

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NavBar from '@/app/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../style.css';
import { createClient } from '@supabase/supabase-js'
import supabase from "@/app/components/supabaseClient";
const CourseInfo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [course, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from('course').select('*');
      if (error) {
        console.error('Error fetching courses:', error);
        setError(error.message);
      } else {
        const transformedData = data.map((course) => ({
          id: course.course_id,
          academic_year: course.academic_year,
          session: course.session,
          term: course.term,
          subject_code: course.subject_code,
          course_num: course.course_num,
          section_num: course.section_num,
          course_title: course.course_title,
          mode_of_delivery: course.mode_of_delivery,
          building: course.building,
          room_num: course.room_num,
          num_students: course.num_students,
          num_tas: course.num_tas,
          credits: course.credits,
          year_level: course.year_level,
          registration_status: course.registration_status,
          status: course.status
        }));
        console.log("Fetched course data:", transformedData); // Log the transformed course data
        setCourses(transformedData);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);
  const handleDelete = async () => {
    setModalShow(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('course')
        .delete()
        .eq('course_id', 1);
      if (error) throw error;
      alert('Course removed successfully');
      router.push('/course');
    } catch (error) {
      setError(error.message);
    }
  };

  // const handleServiceRoleChange = async (e) => {
  //   const newServiceRoleId = e.target.value;
  //   setSelectedServiceRole(newServiceRoleId);

  //   try {
  //     const { data: existingAssignment, error: fetchError } = await supabase
  //       .from('service_role_assign')
  //       .select('*')
  //       .eq('instructor_id', id)
  //       .single();

  //     if (fetchError) throw fetchError;

  //     if (existingAssignment) {
  //       const { error: updateError } = await supabase
  //         .from('service_role_assign')
  //         .update({ service_role_id: newServiceRoleId })
  //         .eq('instructor_id', id);

  //       if (updateError) throw updateError;
  //     } else {
  //       const { error: insertError } = await supabase
  //         .from('service_role_assign')
  //         .insert({
  //           instructor_id: id,
  //           service_role_id: newServiceRoleId,
  //           start_date: new Date().toISOString().split('T')[0],
  //           end_date: null,
  //           expected_hours: 0,
  //         });

  //       if (insertError) throw insertError;
  //     }

  //     alert('Service role updated successfully');
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  // const handleCourseChange = async (e, assignmentId) => {
  //   const newCourseId = e.target.value;

  //   try {
  //     const { error: updateError } = await supabase
  //       .from('course_assign')
  //       .update({ course_id: newCourseId })
  //       .eq('assignment_id', assignmentId);

  //     if (updateError) throw updateError;

  //     setCourseAssignments((prevAssignments) =>
  //       prevAssignments.map((assignment) =>
  //         assignment.assignment_id === assignmentId
  //           ? { ...assignment, course_id: newCourseId }
  //           : assignment
  //       )
  //     );

  //     alert('Course assignment updated successfully');
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  return (
    <div>
      <NavBar />
      <Container fluid className="banner">
        <h2>Instructor Info</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching courses: {error}</p>
        ) : course  ? (
          <>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>Academic Year</td>
                  <td>{course.academic_year}</td>
                </tr>
                <tr>
                  <td>Session</td>
                  <td>{course.session}</td>
                </tr>
                <tr>
                  <td>Term</td>
                  <td>{course.term}</td>
                </tr>
                <tr>
                  <td>Subject Code</td>
                  <td>{course.subject_code}</td>
                </tr>
                <tr>
                  <td>Course Number</td>
                  <td>{course.course_num}</td>
                </tr>
                <tr>
                  <td>Section Number</td>
                  <td>{course.section_num}</td>
                </tr>
                <tr>
                  <td>Course Title</td>
                  <td>{course.course_title}</td>
                </tr>
                <tr>
                  <td>Mode of Delivery</td>
                  <td>{course.mode_of_delivery}</td>
                </tr>
              </tbody>
            </table>
            <div className="instructor-info-footer">
              <button className="btn btn-danger" onClick={handleDelete}>Remove this course</button>
              <button className="btn btn-secondary" onClick={() => router.push('/instructors')}>Back</button>
            </div>
          </>
        ) : (
          <p>Course not found</p>
        )}
      </Container>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to remove this course?</Modal.Body>
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

export default CourseInfo;
