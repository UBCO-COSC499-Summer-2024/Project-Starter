'use client'

import React from 'react';
import CMPS_Table from '@/app/components/CMPS_Table';
import supabase from "@/app/components/supabaseClient";
import Navbar from "@/app/components/NavBar";

export default function Instructors() {
  const fetchUrl = "v_instructors_page";
  const tableName = "instructor";
  const initialSortModel = [
    { field: 'last_name', sort: 'asc' },
  ];

  const columnsConfig = [
    { field: 'id', headerName: 'ID', width: 50, editable: false },
    {
      field: 'full_name',
      headerName: 'Instructor',
      flex: 1,
      editable: false,
      linkConfig: { prefix: '/instructors/instructor_info?id=', idField: 'id' }
    },
    { field: 'ubc_employee_num', headerName: 'Employee Number', flex: 1, editable: false },
    { field: 'title', headerName: 'Title', flex: 1, editable: true },
    { field: 'hire_date', headerName: 'Hired Date', flex: 1, editable: true },
  ];

  const rowUpdateHandler = async (row) => {
    const { error } = await supabase
      .from('instructor')
      .update({
        title: row.title,
        hire_date: row.hire_date,
      })
      .eq('instructor_id', row.id);

    if (error) {
      return { error };
    }
  };

  return (
    <>
      <Navbar />
      <h1>Instructors</h1>
      <CMPS_Table
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        initialSortModel={initialSortModel}
        tableName={tableName}
        rowUpdateHandler={rowUpdateHandler}
        idColumn="instructor_id"
        deleteWarningMessage="Are you sure you want to delete the selected instructors? All evaluations, course assignments, and service role assignments involving this instructor will be deleted as well. This action is not recoverable!"
        newRecordURL="/instructors/create_new_instructor"
      />
    </>
  );
}
