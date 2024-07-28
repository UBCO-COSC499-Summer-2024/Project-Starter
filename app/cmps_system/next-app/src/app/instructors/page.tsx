'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/app/components/NavBar';
import { DataGrid, GridRowModes, GridSlots, GridToolbarContainer, GridRowEditStopReasons } from '@mui/x-data-grid';
import Link from 'next/link';
import { csv2json, json2csv } from 'json-2-csv';
import { Box, Button, Modal, styled, Typography } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { useRouter } from 'next/navigation';
import supabase from "@/app/components/supabaseClient";

const Instructor = () => {
  const tableColumns = [
    { field: 'id', headerName: 'ID', width: 20, editable: false },
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
  const [defaultCSV, setDefaultCSV] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [csvShow, setCsvShow] = useState(false);
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
    const nameParts = newRow.name.split(',').map((part) => part.trim());
    try {
      if (nameParts.length != 2) {
        alert("Please follow the name format: Last Name, First Name.");
        setRowModesModel({
          ...rowModesModel,
          [newRow.id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
        return;
      }
    }
    catch (error) {
      alert("Please follow the name format: Last Name, First Name!");
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      return;
    }
    console.log(nameParts);
    const { error } = await supabase
      .from('instructor')
      .update({
        first_name: nameParts[1],
        last_name: nameParts[0],
        ubc_employee_num: newRow.ubc_employee_num,
        title: newRow.title,
        hire_date: newRow.hire_date,
      })
      .eq('instructor_id', newRow.id);
    console.log("error", error);

    if (error) {
      console.error('Error updating instructor:', error);
      setError(error.message);
      return error;
    }

    setInstructors((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleSaveClick = () => {
    selectedRows.forEach((id) => {
      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.View }
      }));
    });
  };

  const { push } = useRouter();
  const EditToolbar = useCallback((props) => {
    console.log(props);
    const { setInstructors, setRowModesModel, selectedRows } = props;

    const handleClick = () => {
      push("/instructors/create_new_instructor");
    };

    const handleDeleteClick = () => async () => {
      if (confirm("Are you sure you want to delete these rows? This action is not recoverable!")) {
        const response = await supabase
          .from('instructor')
          .delete()
          .in("instructor_id", selectedRows);
        setInstructors(instructors.filter((row) => !selectedRows.includes(row.id)));
      }
    };

    const handleCancelClick = () => {
      setRowModesModel((prev) => {
        const newModel = { ...prev };
        selectedRows.forEach((id) => {
          newModel[id] = { mode: GridRowModes.View, ignoreModifications: true };
        });
        return newModel;
      });
    };

    const handleEditClick = () => {
      setRowModesModel((prev) => {
        const newModel = { ...prev };
        selectedRows.forEach((id) => {
          newModel[id] = { mode: GridRowModes.Edit };
        });
        return newModel;
      });
    };

    const isInEditMode = selectedRows.some((id) => rowModesModel[id]?.mode === GridRowModes.Edit);
    var buttons = (
      <>
        <Button
          className="textPrimary"
          onClick={handleEditClick}
          color="inherit"
        >✏️Edit</Button>
        <Button
          onClick={handleDeleteClick}
          color="inherit"
        >🗑️ Delete</Button>
      </>
    );

    if (isInEditMode) {
      buttons = (
        <>
          <Button
            onClick={handleSaveClick}>
            💾 Save
          </Button>
          <Button
            className="textPrimary"
            onClick={handleCancelClick}
            color="inherit">❌ Cancel</Button>
        </>
      );
    }

    return (
      <GridToolbarContainer>
        <Button onClick={handleClick}>
          ➕ Add record
        </Button>

        <Button onClick={useCallback(() => {
          console.log(instructors);
          setDefaultCSV(json2csv(instructors));
          setCsvShow(true);
        }, [instructors])}>
          📝 Edit As CSV
        </Button>
        {buttons}
      </GridToolbarContainer>
    );
  }, [rowModesModel, instructors, selectedRows]);

  const renderTable = () => {
    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p>Error fetching instructors: {error}</p>;
    }
    return (
      <div style={{ padding: '16px', width: '100%' }}>
        <DataGrid
          onRowEditStop={(params, event) => {
            if (params.reason === GridRowEditStopReasons.rowFocusOut) {
              event.defaultMuiPrevented = true;
            }
          }}
          onProcessRowUpdateError={(event) => {
            console.error(event);
          }}
          editMode="row"
          rows={instructors}
          columns={tableColumns}
          processRowUpdate={handleProcessRowUpdate}
          pageSizeOptions={[10000]}
          slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
          rowModesModel={rowModesModel}
          slotProps={{
            toolbar: { setInstructors, setRowModesModel, selectedRows },
          }}
          checkboxSelection={true}
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          onCellKeyDown={(params, event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSaveClick();
            }
          }}
        />
      </div>
    );
  };

  return (
    <main>
      <Navbar />
      <h1 style={{ marginRight: "10px" }}>Instructors</h1>
      <div className="banner" style={{ width: '100%' }}>
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
              if (!confirm("Are you sure to submit? This will rewrite all records in the database with the imported CSV and this cannot be undone!"))
                return;
              const csvText = csv.current.value;
              const newJSON = await csv2json(csvText);
              const oldJSON = instructors;
              var snapshot = JSON.parse(JSON.stringify(oldJSON));
              for (const newRow of newJSON) {
                try {
                  const nameParts = newRow.name.split(',').map((part) => part.trim());
                  if (nameParts.length != 2) {
                    alert("Please follow the name format: Last Name, First Name on row " + newRow.id);
                    return;
                  }

                  newRow.first_name = nameParts[1];
                  newRow.last_name = nameParts[0];
                } catch (error) {
                  alert("Please follow the name format: Last Name, First Name on row " + newRow.id);
                  return;
                }

                if (!snapshot.map(row => row.id).includes(newRow.id)) {
                  // check for create
                  console.log("create");
                  snapshot.push(newRow);
                  // do corresponding database operation
                  const error = (await supabase
                    .from("instructor")
                    .insert({
                      instructor_id: newRow.id ? newRow.id : undefined,
                      first_name: newRow.first_name,
                      last_name: newRow.last_name,
                      ubc_employee_num: newRow.ubc_employee_num,
                      title: newRow.title,
                      hire_date: newRow.hire_date
                    })).error;
                  if (error) {
                    alert("Error on row " + newRow.id + ": " + error.message);
                    return;
                  }
                } else if (snapshot.map(row => row.id).includes(newRow.id)) {
                  // check for update
                  console.log("update");
                  snapshot[snapshot.map(row => row.id).indexOf(newRow.id)] = newRow;
                  // do corresponding database operation 
                  const error = (await supabase
                    .from("instructor")
                    .update({
                      first_name: newRow.first_name,
                      last_name: newRow.last_name,
                      ubc_employee_num: newRow.ubc_employee_num,
                      title: newRow.title,
                      hire_date: newRow.hire_date
                    }).eq("instructor_id", newRow.id)).error;
                  if (error) {
                    alert("Error on row " + newRow.id + ": " + error.message);
                    return;
                  }
                }
              }
              for (const oldRow of oldJSON) {
                if (!newJSON.map(row => row.id).includes(oldRow.id)) {
                  console.log("delete");
                  // check for delete
                  snapshot.splice(snapshot.map(row => row.id).indexOf(oldRow.id), 1);
                  // do corresponding database operation 
                  console.log((await supabase
                    .from("instructor")
                    .delete().eq("instructor_id", oldRow.id)).error);
                }
              }

              setInstructors(snapshot);
              handleCSVClose();
            }}
            >Apply</Button>
          </Box>
        </Modal>
      </div>
    </main>
  );
};

export default Instructor;
