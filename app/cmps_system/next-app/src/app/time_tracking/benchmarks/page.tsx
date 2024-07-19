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
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

export default function Home() {

    const [instructors, setInstructors] = useState([])
    useEffect(() => {
        (async () => {

            try {
                var { data, error } = await supabase.from("list_of_instructors").select();
                console.log(data)
                setInstructors(data.map((instructor) => instructor.name))
                var { data, error } = await supabase.from("v_benchmark").select();
                if (error) throw error;
                console.log(data)
                setTimeData(data)
            }

            catch (error) {
                console.error("Error fetching data:", error)

            }
        })()
    }, [])

    const tableColumns = [

        { field: 'instructor', headerName: 'Instructor', width: 200, editable: true, type: 'singleSelect', valueOptions: instructors },
        { field: 'year', headerName: 'Year', width: 200, editable: true },

        { field: 'hours', headerName: 'Hours', width: 200, editable: true }
    ]

    const [TimeData, setTimeData] = useState([
    ]);



    const { push } = useRouter();
    const [defaultCSV, setDefaultCSV] = useState("")
    const [id, setId] = useState('0') 
    const [rowModesModel, setRowModesModel] = React.useState({});

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
    const handleSaveClick = (id) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {

        const response = await supabase
            .from('service_hours_benchmark')
            .delete()
            .eq('benchmark_id', id)


        setTimeData(TimeData.filter((row) => row.id !== id));
        const result = await supabase.from('service_hours_benchmark').delete().eq('benchmark_id', id).select()
        console.log(result)

    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    }
    const handleEditClick = (id) => () => {
        try {
            if (!TimeData.map(row => row.id).includes(id)) {
                alert("Please select a valid row.")
                return
            }
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        }
        catch {

        }
    };
    return (
        <main>
            <Navbar />
            <h1 style={{ marginRight: "10px" }}>Service Hours Benchmarks</h1>
            <Button onClick={() => { push("/time_tracking") }}>Return to Time Tracking</Button>

            <Container>
                <Row className="h-32">
                    <div className="tw-p-3">
                        <DataGrid
                            processRowUpdate={async (newRow) => {
                                const updatedRow = { ...newRow, isNew: false };
                                console.log(updatedRow)
                                for (var i = 0; i < TimeData.length; i++) {
                                    if (TimeData[i].id == newRow.id) {
                                        TimeData[i].instructor = newRow.instructor
                                        TimeData[i].year = newRow.year
                                        TimeData[i].hours = newRow.hours
                                    }
                                }

                                // check if this id exsits in supabase
                                const res = await supabase.from('service_hours_benchmark').select().eq('benchmark_id', id)
                                console.log(res)
                                if (res.data.length == 0) {
                                    //insert
                                    console.log("insert")
                                    const row = updatedRow
                                    const res2 = await supabase.from('service_hours_benchmark').insert({instructor_id: row.instructor.split(" - ")[0], year: row.year, hours: row.hours })
                                    console.log(res2)
                                    if (res.error) {
                                        alert(res.error.message)
                                    }
                                }
                                else {
                                    // update
                                    console.log("update")
                                    const row = updatedRow
                                    console.log(row)
                                    const res2 = await supabase.from('service_hours_benchmark').update({instructor_id: row.instructor.split(" - ")[0], year: row.year, hours: row.hours }).eq('benchmark_id', row.id).select()
                                    console.log(res2)
                                    if (res.error) {
                                        alert(res.error.message)
                                    }
                                }
                            }}
                            onProcessRowUpdateError={(event) => {
                                console.error(event)    
                            }}
                            editMode="row"
                            rows={TimeData}
                            columns={tableColumns}
                            pageSizeOptions={[10000]}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                            rowModesModel={rowModesModel}
                            slotProps={{
                                toolbar: { setTimeData, setRowModesModel, id },
                            }}
                            checkboxSelection={true}
                            disableMultipleRowSelection={true}
                            onRowSelectionModelChange={(newSelection) => {
                                console.log(newSelection[0])
                                setId(newSelection[0])
                            }}
                            onRowEditStop={(params, event) => {
                                if (params.reason === GridRowEditStopReasons.rowFocusOut) {
                                    event.defaultMuiPrevented = true;
                                }
                            }}
                        />
                    </div>
                </Row>
            </Container>

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
                        setTimeData(json_time_data)
                        const response = await supabase
                            .from('service_hours_benchmark')
                            .delete()
                            .neq("benchmark_id", -1)

                        console.log(response)
                        json_time_data.map(async row => {
                            const { error } = await supabase
                                .from('service_hours_benchmark')
                                .insert({ benchmark_id: row.id, instructor_id: row.instructor.split(" - ")[0], year: row.year, hours: row.hours })
                            console.log(error)
                        })
                        handleCSVClose()
                    }}

                    >Apply</Button>
                </Box>
            </Modal>
        </main >
    );
}
