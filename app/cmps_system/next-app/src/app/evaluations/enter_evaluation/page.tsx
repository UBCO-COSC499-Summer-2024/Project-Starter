'use client';

import React, { useState, useEffect } from 'react';
import NavBar from '@/app/components/NavBar';
import { supabase } from '../../supabaseClient';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

// Evaluation form component
const EvaluationForm = () => {
  const [formData, setFormData] = useState({
    evaluation_type_id: '',
    courseId: '',
    instructorId: '',
    serviceRoleId: '',
    evaluationDate: '',
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const answerData = [];

    // Collect variable number of answers from form data
    for (const [key, value] of Object.entries(formData)) {
      if (key.startsWith("answer")) {
        const questionNum = key.substring(6);
        answerData.push({
          questionNum,
          answer: value
        });
      }
    }

    console.log(answerData.map(answer => ({
      evaluation_type_id: parseInt(formData.evaluation_type_id),
      course_id: parseInt(formData.courseId),
      instructor_id: parseInt(formData.instructorId),
      service_role_id: parseInt(formData.serviceRoleId),
      evaluation_date: formData.evaluationDate,
      metric_num: answer.questionNum,
      answer: answer.answer
    })));

    // Insert evaluation entry into database
    const { data, error } = await supabase
      .from('evaluation_entry')
      .insert(answerData.map(answer => ({
        evaluation_type_id: parseInt(formData.evaluation_type_id),
        course_id: parseInt(formData.courseId),
        instructor_id: parseInt(formData.instructorId),
        service_role_id: parseInt(formData.serviceRoleId),
        evaluation_date: formData.evaluationDate,
        metric_num: answer.questionNum,
        answer: answer.answer
      })));

    // Display modal message based on success or failure
    if (error) {
      setModalTitle('Error');
      setModalMessage(`Failed to create evaluation: ${error.message}`);
      setIsSuccess(false);
    } else {
      setModalTitle('Success');
      setModalMessage('Evaluation created successfully.');
      setIsSuccess(true);
    }

    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
    if (isSuccess) {
      window.location.href = '/evaluations';
    }
  };

  const [evaluationTypes, setEvaluationTypes] = useState([]);
  const [evaluationTypeInfo, setEvaluationTypeInfo] = useState([]);
  const [evaluationMetrics, setEvaluationMetrics] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [serviceRoles, setServiceRoles] = useState([]);

  useEffect(() => {
    fetchEvaluationTypes();
    fetchInstructors();
    fetchCourses();
    fetchServiceRoles();
    fetchEvaluationTypeInfo();
    fetchEvaluationMetrics();
  }, []);

  const fetchEvaluationTypes = async () => {
    const { data, error } = await supabase.from('evaluation_type').select('evaluation_type_id, evaluation_type_name, description');
    if (error) {
      console.error('Error fetching evaluation types:', error.message);
    } else {
      setEvaluationTypes(data);
    }
  };

  const fetchInstructors = async () => {
    const { data, error } = await supabase.from('instructor').select('instructor_id, first_name, last_name');
    if (error) {
      console.error('Error fetching instructors:', error.message);
    } else {
      setInstructors(data);
    }
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase.from('course').select('course_id, subject_code, course_num, section_num, course_title');
    const formattedCourses = data.map((course) => ({
      course_id: course.course_id,
      title: `${course.subject_code} ${course.course_num} ${course.section_num}`,
      full_title: course.course_title
    }));
    if (error) {
      console.error('Error fetching courses:', error.message);
    } else {
      setCourses(formattedCourses);
    }
  };

  const fetchServiceRoles = async () => {
    const { data, error } = await supabase.from('service_role').select('service_role_id, title, description');
    if (error) {
      console.error('Error fetching service roles:', error.message);
    } else {
      setServiceRoles(data);
    }
  };

  const fetchEvaluationTypeInfo = async () => {
    const { data, error } = await supabase.from('v_evaluation_type_info').select('id, name, description, num_entries, requires_course, requires_instructor, requires_service_role');
    if (error) {
      console.error('Error fetching evaluation type info:', error.message);
    } else {
      setEvaluationTypeInfo(data);
    }
  };

  const fetchEvaluationMetrics = async () => {
    const { data, error } = await supabase.from('evaluation_metric').select('evaluation_type_id, metric_num, metric_description');
    if (error) {
      console.error('Error fetching evaluation metrics:', error.message);
    } else {
      setEvaluationMetrics(data);
    }
  };

  const renderQuestionFields = () => {
    const evaluationType = evaluationTypeInfo.find((type) => type.id == formData.evaluation_type_id);
    const questions = evaluationMetrics.filter((metric) => metric.evaluation_type_id == formData.evaluation_type_id);
    if (evaluationType) {
      const numEntries = evaluationType.num_entries;
      const requiresCourse = evaluationType.requires_course;
      const requiresInstructor = evaluationType.requires_instructor;
      const requiresServiceRole = evaluationType.requires_service_role;

      const formFields = [];
      // Add instructor field if required
      if (requiresInstructor) {
        formFields.push(
          <div className="form-group" key="instructor">
            <label htmlFor="instructorId">Instructor</label>
            <select
              id="instructorId"
              name="instructorId"
              value={formData.instructorId}
              onChange={handleChange}
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.instructor_id} value={instructor.instructor_id}>
                  {`${instructor.first_name} ${instructor.last_name}`}
                </option>
              ))}
            </select>
          </div>
        );
      }

      // Add course field if required
      if (requiresCourse) {
        formFields.push(
          <div className="form-group" key="course">
            <label htmlFor="courseId">Course</label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id} title={course.full_title}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        );
      }

      // Add service role field if required
      if (requiresServiceRole) {
        formFields.push(
          <div className="form-group" key="serviceRole">
            <label htmlFor="serviceRoleId">Service Role</label>
            <select
              id="serviceRoleId"
              name="serviceRoleId"
              value={formData.serviceRoleId}
              onChange={handleChange}
            >
              <option value="">Select Service Role</option>
              {serviceRoles.map((role) => (
                <option key={role.service_role_id} value={role.service_role_id} title={role.description}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>
        );
      }

      // Add question/answer fields
      for (let i = 0; i < numEntries; i++) {
        formFields.push(
          <div className="form-group" key={`question${i + 1}`}>
            <label htmlFor={`answer${i + 1}`}>Question {i + 1}: {questions[i].metric_description}</label>
            <input
              type="number"
              id={`answer${i + 1}`}
              name={`answer${i + 1}`}
              value={formData[`answer${i + 1}`]}
              onChange={handleChange}
            />
          </div >
        );
      }

      return formFields;
    }
    return null;
  };

  return (
    <>
      <main>
        <NavBar />
        <h1 style={{ textAlign: 'center' }}>Enter Evaluation</h1>
        <div className="container">
          <form className="instructor-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="evaluation_type_id">Evaluation Type</label>
              <select
                id="evaluation_type_id"
                name="evaluation_type_id"
                value={formData.evaluation_type_id}
                onChange={handleChange}
              >
                <option value="">Select Evaluation Type</option>

                {evaluationTypes.map((type) => (
                  <option
                    key={type.evaluation_type_id}
                    value={type.evaluation_type_id}
                    title={type.description} // Shows the evaluation type description as a tooltip
                  >
                    {type.evaluation_type_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="evaluationDate">Evaluation Date</label>
              <input
                type="date"
                id="evaluationDate"
                name="evaluationDate"
                value={formData.evaluationDate}
                onChange={handleChange}
              />
            </div>

            {renderQuestionFields()}

            <div className="buttons">
              <button type="submit">Submit</button>
              <button
                type="button"
                className="back-button"
                onClick={() => (window.location.href = '/evaluations')}
              >
                Back
              </button>
            </div>
          </form>
        </div>

        <Modal show={modalShow} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default EvaluationForm;
