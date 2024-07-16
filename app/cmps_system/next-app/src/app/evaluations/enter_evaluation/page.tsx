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

    const { data, error } = await supabase
      .from('evaluation_entry')
      .insert([
        {
          evaluation_type_id: formData.evaluation_type_id,
          course_id: formData.courseId,
          instructor_id: formData.instructorId,
          service_role_id: formData.serviceRoleId,
          evaluation_date: formData.evaluationDate,
          metric_num: 1, //TODO: Put this in a for-loop, submitting each question/answer pair
          answer: 1
        }
      ]);

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
    const { data, error } = await supabase.from('v_evaluation_type_info').select('id, name, description, num_entries');
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

      const questionFields = [];
      for (let i = 0; i < numEntries; i++) {
        questionFields.push(
          <div className="form-group" key={i}>
            <div className="question-answer">
              <label htmlFor={`answer${i + 1}`}>Question {i + 1}: {questions[i].metric_description}</label>
              <input
                type="text"
                id={`answer${i + 1}`}
                name={`answer${i + 1}`}
                value={formData[`answer${i + 1}`]}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      }
      return questionFields;
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
              <label htmlFor="courseId">Course ID</label>
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

            <div className="form-group">
              <label htmlFor="instructorId">Instructor ID</label>
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

            <div className="form-group">
              <label htmlFor="serviceRoleId">Service Role ID</label>
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
          <style jsx>{`
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .instructor-form {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .form-group {
              display: flex;
              flex-direction: column;
            }
            .form-group label {
              margin-bottom: 8px;
              font-weight: bold;
            }
            .form-group input,
            .form-group textarea,
            .form-group select {
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 4px;
              font-size: 16px;
            }
            .form-group textarea {
              resize: vertical;
              height: 100px;
            }
            .buttons {
              display: flex;
              justify-content: space-between;
              gap: 10px;
            }
            button {
              padding: 10px 20px;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
            }
            button[type='submit'] {
              background-color: #0070f3;
              color: white;
            }
            .back-button {
              background-color: #ccc;
            }
            .radio-group {
              display: flex;
              gap: 5px;
            }
            .radio-group input[type='radio'] {
              margin-right: 5px;
            }
          `}</style>
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
