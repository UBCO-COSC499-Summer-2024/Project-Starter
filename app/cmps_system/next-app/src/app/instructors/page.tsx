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
import { Box, Button, Modal, styled, Typography } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';

import { useRouter } from 'next/navigation';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
const Instructor = () => {
  const tableColumns = [
    { field: 'id', headerName: 'Employee ID', width: 20, editable: false },
    {
      field: 'name',
      headerName: 'Instructors',
      width: 200,
      editable: true,
      renderCell: (params) => (
        <Link
          href={`/instructors/instructor_info?id=${params.row.id}`}
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
  const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };

  const TextareaAutosize = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

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
          name: `${instructor.last_name}, ${instructor.first_name}`,
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
    <main>
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

            const newJSON = csv2json(csvText);
            const oldJSON = instructors;
            var snapshot = JSON.parse(JSON.stringify(oldJSON))
            for (const newRow of newJSON) {
              try {
                if (newRow.name.split(", ").length != 2) {
                  alert("Please follow the name format: Last Name, First Name on row " + newRow.id)
                  return
                }
              }
              catch (error) {
                alert("Please follow the name format: Last Name, First Name on row " + newRow.id)
                return
              }


              if (!snapshot.map(row => row.id).includes(newRow.id)) {
                // check for create
                console.log("create")
                snapshot.push(newRow)
                // do coresponding database operation
                const error = (await supabase
                  .from("instructor")
                  .insert({
                    instructor_id: newRow.id ? newRow.id : undefined,
                    first_name: newRow.name.split(", ")[1],
                    last_name: newRow.name.split(", ")[0],
                    ubc_employee_num: newRow.ubc_employee_num,
                    title: newRow.title,
                    hire_date: newRow.hire_date
                  })).error
                if (error) {
                  alert("Error on row " + newRow.id + ": " + error.message)
                  return
                }

              }
              else if (snapshot.map(row => row.id).includes(newRow.id)) {
                // check for update
                console.log("update")
                snapshot[snapshot.map(row => row.id).indexOf(newRow.id)] = newRow
                // do coresponding database operation 
                const error = (await supabase
                  .from("instructor")
                  .update({
                    first_name: newRow.name.split(", ")[1],
                    last_name: newRow.name.split(", ")[0],
                    ubc_employee_num: newRow.ubc_employee_num,
                    title: newRow.title,
                    hire_date: newRow.hire_date
                  }).eq("instructor_id", newRow.id)).error
                if (error) {
                  alert("Error on row " + newRow.id + ": " + error.message)
                  return
                }
              }
            }
            for (const oldRow of oldJSON) {
              if (!newJSON.map(row => row.id).includes(oldRow.id)) {
                console.log("delete")
                // check for delete
                snapshot.splice(snapshot.map(row => row.id).indexOf(oldRow.id), 1)
                // do coresponding database operation 
                console.log((await supabase
                  .from("instructor")
                  .delete().eq("instructor_id", oldRow.id)).error)
              }
            }

            setInstructors(snapshot)
            handleCSVClose()
          }}

          >Apply</Button>
        </Box>
      </Modal>

    </Container >
  );
};

export default Instructor;
