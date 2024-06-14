'use client';

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavLink from 'react-bootstrap/NavLink';
import './style.css'; // Ensure this is the correct path
import { supabase } from '../../supabaseClient'; // Ensure this is the correct path

const Instructor = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      const { data, error } = await supabase.from('instructor').select('*');
      if (error) {
        console.error('Error fetching instructors:', error);
      } else {
        setInstructors(data);
      }
      setLoading(false);
    };

    fetchInstructors();
  }, []);

  return (
    <Container fluid className="banner">
      <div className="top-bar">
        <div className="header-text">CMPS Department Management</div>
        <img className="profile-img" src="https://via.placeholder.com/69x74" style={{ width: 69, height: 74 }} />
        <div className="profile-name">dingusmcgee</div>
      </div>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <ul className="navbarButtonsList">
            <li className="navbarButton">
              <a href="/instructor_dashboard/instructor" className="navbarButtonText">
                INSTRUCTORS
              </a>
            </li>
            <li className="navbarButton">
              <a href="/instructor_dashboard/courses" className="navbarButtonText">
                COURSES
              </a>
            </li>
            <li className="navbarButton">
              <a href="/instructor_dashboard/service_roles" className="navbarButtonText">
                SERVICE ROLES
              </a>
            </li>
            <li className="navbarButton">
              <a href="/instructor_dashboard/evaluations" className="navbarButtonText">
                EVALUATIONS
              </a>
            </li>
            <li className="navbarButton">
              <a href="/instructor_dashboard/time_tracking" className="navbarButtonText">
                TIME TRACKING
              </a>
            </li>
            <li className="navbarButton">
              <a href="/instructor_dashboard/tools" className="navbarButtonText">
                TOOLS
              </a>
            </li>
          </ul>
        </Col>
      </Row>
      <div className="add-instructor">
        <div className="icon-container">
          <div className="icon-background"></div>
          <div className="icon-foreground"></div>
        </div>
        <NavLink href="/instructor_dashboard/add_instructor" className="text">
          Create new Instructor
        </NavLink>
      </div>
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : instructors.length > 0 ? (
          <>
            <div className="table-header">
              <div>Instructors</div>
              <div>Employee Number</div>
              <div>Title</div>
              <div>Hired Date</div>
            </div>
            {instructors.map((instructor) => (
              <div className="table-row" key={instructor.instructor_id}>
                <div>{instructor.first_name} {instructor.last_name}</div>
                <div>{instructor.ubc_employee_num}</div>
                <div>{instructor.title}</div>
                <div>{instructor.hire_date}</div>
              </div>
            ))}
          </>
        ) : (
          <p>Instructor doesn't exist</p>
        )}
      </div>
    </Container>
  );
};

export default Instructor;
