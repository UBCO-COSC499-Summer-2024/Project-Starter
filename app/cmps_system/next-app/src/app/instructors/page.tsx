'use client';

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from '@/app/components/NavBar';
import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';
import Image from 'next/image';
// import { supabase } from '../supabaseClient';
import './style.css';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
const Instructor = () => {
  const tableColumns = [
    {
      field: 'name',
      headerName: 'Instructors',
      width: 200,
      editable: true,
      renderCell: (params) => (
        <Link 
          href={`/instructors/instructor_info?id=${params.row.id}&firstName=${params.row.firstName}&lastName=${params.row.lastName}&ubcEmployeeNum=${params.row.ubc_employee_num}&title=${params.row.title}&hireDate=${params.row.hire_date}`} 
          legacyBehavior
        >
          {params.value}
        </Link>
      )
    },
    { field: 'ubc_employee_num', headerName: 'Employee Number', width: 200, editable: true },
    { field: 'title', headerName: 'Title', width: 200, editable: true },
    { field: 'hire_date', headerName: 'Hired Date', width: 200, editable: true },
  ];

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
        const transformedData = data.map((instructor) => ({
          id: instructor.instructor_id,
          name: `${instructor.first_name} ${instructor.last_name}`,
          firstName: instructor.first_name,
          lastName: instructor.last_name,
          ubc_employee_num: instructor.ubc_employee_num,
          title: instructor.title,
          hire_date: instructor.hire_date,
        }));
        setInstructors(transformedData);
      }
      setLoading(false);
    };

    fetchInstructors();
  }, []);

  const handleProcessRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow };
    const nameParts = newRow.name.split(' ');

    const { error } = await supabase
      .from('instructor')
      .update({
        first_name: nameParts[0],
        last_name: nameParts[1],
        ubc_employee_num: newRow.ubc_employee_num,
        title: newRow.title,
        hire_date: newRow.hire_date,
      })
      .eq('instructor_id', newRow.id);

    if (error) {
      console.error('Error updating instructor:', error);
      setError(error.message);
      return error;
    }

    setInstructors((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const renderTable = () => {
    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p>Error fetching instructors: {error}</p>;
    }
    return (
      <Container>
        <div className="tw-p-3">
          <DataGrid
            editMode="row"
            rows={instructors}
            columns={tableColumns}
            processRowUpdate={handleProcessRowUpdate}
            pageSizeOptions={[10000]}
          />
        </div>
      </Container>
    );
  };

  return (
    <Container fluid className="banner">
      <Navbar />
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ marginRight: '10px' }}>Instructors</h1>
        <Link href="/instructors/create_new_instructor" style={{ display: 'flex', alignItems: 'center', margin: '0 3em', fontSize: '1.5em' }}>
          <Image src="/plus.svg" alt="Add new instructor plus icon" width={20} height={20} style={{ margin: '20px' }} />
          Create new instructor
        </Link>
      </span>
      {renderTable()}
    </Container>
  );
};

export default Instructor;
