'use client';
// this file uses copilot auto compleet in all around areas
'use client'
// This page provided CURD (C and U is still working on) function to the benchmark table 

import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import { csv2json, json2csv } from 'json-2-csv';
import Navbar from "@/app/components/NavBar"
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link';
import Image from 'next/image';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormControl, FormGroup, FormLabel, NavDropdown, NavLink, NavbarCollapse, NavbarText, Row, Table } from "react-bootstrap";
import { Button, Modal, Typography, Box, styled } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useState, useEffect, useRef, useCallback } from "react";
import { DataGrid, GridSlots, GridToolbarContainer, GridRowModes, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';
import React from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
const Instructor = () => {
  
  const EditToolbar = useCallback((props) => {
    console.log(props)
    const { setTimeData, setRowModesModel, id } = props;

    const handleClick = () => {
        var id = 1;
        if (TimeData.length >= 1) {
            for (var i = 0; i < TimeData.length; i++) {
                id = Math.max(id, TimeData[i].id + 1)
            }
        }
        console.log(id)
        setTimeData((oldRows) => [...oldRows, { id, name: '', year: '', hours: '' }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'instructor_name' },

        }));

    };

    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    var buttons = (<>
        <Button
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
        >✏️Edit</Button>
        <Button
            onClick={handleDeleteClick(id)}
            color="inherit"
        >🗑️ Delete</Button></>)

    if (isInEditMode) {
        buttons = (<>
            <Button
                onClick={handleSaveClick(id)}>
                💾 Save
            </Button>
            <Button
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit">❌ Cancel</Button>
        </>)

    }


    return (
        <GridToolbarContainer>
            <Button onClick={() => { handleClick() }}>
                ➕ Add record
            </Button>

            <Button onClick={useCallback(() => {
                // csv.current.value=(json2csv(TimeData))
                console.log(TimeData)
                setDefaultCSV(json2csv(TimeData))
                setCsvShow(true)
            }, [TimeData])}>
                📝 Edit As CSV
            </Button>
            {buttons}
        </GridToolbarContainer>
    )
}, [rowModesModel, TimeData]);

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
