'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from '@/app/components/NavBar';
import { DataGrid, GridRowModes, GridSlots, GridToolbarContainer } from '@mui/x-data-grid';
import Link from 'next/link';
import Image from 'next/image';
// import { supabase } from '../supabaseClient';
import './style.css';
import { createClient } from '@supabase/supabase-js'
import { csv2json, json2csv } from 'json-2-csv';
import { Box, Button, Modal, TextareaAutosize, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
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
  const [rowModesModel, setRowModesModel] = useState({});
  const [defaultCSV, setDefaultCSV] = useState("")
  const [id, setId] = useState(0)
  const [csvShow, setCsvShow] = useState(false)
  const handleCSVClose = () => setCsvShow(false);
  const csv = useRef(null);


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

  const { push } = useRouter();
  const EditToolbar = useCallback((props) => {
    console.log(props)
    const { setInstructors, setRowModesModel, id } = props;

    const handleClick = () => {
      push("/instructors/create_new_instructor")
    };

    const handleSaveClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
      setInstructors(instructors.filter((row) => row.id !== id));
      if (confirm("Are you sure you want to delete this row? This action is not recoverable!")) {
        const response = await supabase
          .from('instructor')
          .delete()
          .eq("instructor_id", id)
      }
    };

    const handleCancelClick = (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    }
    const handleEditClick = (id) => () => {
      try {
        if (!instructors.map(row => row.id).includes(id)) {
          alert("Please select a valid row.")
          return
        }
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
      }
      catch {

      }
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

    const [csvShow, setCsvShow] = useState(false)

    return (
      <GridToolbarContainer>
        <Button onClick={() => { handleClick() }}>
          ➕ Add record
        </Button>

        <Button onClick={useCallback(() => {
          // csv.current.value=(json2csv(instructors))
          console.log(instructors)
          setDefaultCSV(json2csv(instructors))
          setCsvShow(true)
        }, [instructors])}>
          📝 Edit As CSV
        </Button>
        {buttons}
      </GridToolbarContainer>
    )
  }, [rowModesModel, instructors]);

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
            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
            rowModesModel={rowModesModel}
            slotProps={{
              toolbar: { setInstructors, setRowModesModel, id },
            }}
            checkboxSelection={true}
            disableMultipleRowSelection={true}
            onRowSelectionModelChange={(newSelection) => {
              console.log(newSelection[0])
              setId(newSelection[0])
            }}
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
        {/* <Link href="/instructors/create_new_instructor" style={{ display: 'flex', alignItems: 'center', margin: '0 3em', fontSize: '1.5em' }}>
          <Image src="/plus.svg" alt="Add new instructor plus icon" width={20} height={20} style={{ margin: '20px' }} />
          Create new instructor
        </Link> */}
      </span>
      {renderTable()}

      <Modal open={csvShow} onClose={handleCSVClose}>
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "80%",
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Batch Editing
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextareaAutosize defaultValue={defaultCSV} ref={csv}></TextareaAutosize>
          </Typography>



          <Button className="!tw-m-2" variant="outlined" onClick={handleCSVClose}>Discard</Button>
          <Button className="!tw-m-2" variant="contained" onClick={async () => {
            if (!confirm("Are you sure to submit? This will rewrite all records in the database with the imported CSV and this cannot be undo!"))
              return
            const csvText = csv.current.value;
            const json_time_data = csv2json(csvText)
            setInstructors(json_time_data)

            handleCSVClose()
          }}

          >Apply</Button>
        </Box>
      </Modal>

    </Container >
  );
};

export default Instructor;
