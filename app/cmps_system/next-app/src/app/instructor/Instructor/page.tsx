'use client';

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from '@/app/components/NavBar';
import './style.css';
import { supabase } from '../../supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

const Instructor = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      const { data, error } = await supabase.from('instructor').select('*');
      if (error) {
        console.error('Error fetching instructors:', error);
        setError(error.message);
      } else {
        setInstructors(data);
      }
      setLoading(false);
    };

    fetchInstructors();
  }, []);

  return (
    <Container fluid className="banner">
      <Navbar />
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ marginRight: "10px" }}>Instructors</h1>
        <Link href="/instructor/Instructor/create_new_instructor" style={{ display: "flex", alignItems: "center", margin: "0 3em", fontSize: "1.5em" }}>
          <Image src="/plus.svg" alt="Add new instructor plus icon" width={20} height={20} style={{ margin: '20px' }} />
          Create new instructor
        </Link>
      </span>
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching instructors: {error}</p>
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
          <p>No instructors found</p>
        )}
      </div>
    </Container>
  );
};

export default Instructor;
