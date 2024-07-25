'use client'
import { useEffect, useRef, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { csv2json, json2csv } from 'json-2-csv';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
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
import { DataGrid, GridRowModes, GridSlots, GridToolbarContainer } from '@mui/x-data-grid';

import React from "react";
import Navbar from "@/app/components/NavBar";
import Container from 'react-bootstrap/Container';

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
    const [courseData, setCourseData] = useState([]);
    const { push } = useRouter();
    const [defaultCSV, setDefaultCSV] = useState("");
    const [csvShow, setCsvShow] = useState(false);
    const csv = useRef(null);

    useEffect(() => {
        (async () => {
            try {

                const { data, error } = await supabase.from("v_course").select();

                if (error) throw error;
                setCourseData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, []);

    const handleSectionClick = (id, event) => {
        event.preventDefault();
        push(`/courses/course_info?id=${id}`);
    };

    const renderSectionNumber = (params) => {
        return (
            <a
                href={`/courses/course_info?id=${params.row.id}`}
                onClick={(event) => handleSectionClick(params.row.id, event)}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
                {params.value}
            </a>
        );
    };

    const renderInstructorNames = (params) => {
        const names = params.row.instructor_names.split(', ');
        const ids = params.row.instructor_ids.split(', ');
        return (
            <div>
                {names.map((name, index) => (
                    <React.Fragment key={ids[index]}>
                        <a href={`/instructors/instructor_info?id=${ids[index]}`}>{name}</a>
                        {index < names.length - 1 && <span>, </span>}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const tableColumns = [

        { field: 'course_title', headerName: 'Course', width: 100, editable: true },
        { field: 'location', headerName: 'Location', width: 200, editable: true },
        { field: 'instructor_name', headerName: 'Instructor', width: 200, editable: true },
        { field: 'num_students', headerName: 'Number of Students', width: 200, editable: true },
        { field: 'num_TAs', headerName: 'Number of TAs', width: 200, editable: true },
        { field: 'average_grade', headerName: 'Average Grade', width: 200, editable: true },
        { field: 'year_level', headerName: 'Year Level', width: 200, editable: true },
        { field: 'session', headerName: 'Session', width: 200, editable: true },
    ]

    const [courseData, setCourseData] = useState([
    ]);
    const { push } = useRouter();
    const [defaultCSV, setDefaultCSV] = useState("");
    const [id, setId] = useState(0)

    const [rowModesModel, setRowModesModel] = React.useState({});

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
        setCourseData(courseData.filter((row) => row.id !== id));
        if(confirm("Are you sure you want to delete this row? This action is not recoverable!"))
        {
            const response = await supabase
            .from('course')
            .delete()
            .eq("course_id", id)
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
            if (!courseData.map(row => row.id).includes(id)) {
                alert("Please select a valid row.")
                return
            }
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        }
        catch {

        }
    };
    
    const EditToolbar = useCallback((props) => {
        console.log(props)
        const { setCourseData, setRowModesModel, id } = props;

        const handleClick = () => {
            var id = 1;
            if (courseData.length >= 1) {
                for (var i = 0; i < courseData.length; i++) {
                    id = Math.max(id, courseData[i].id + 1)
                }
            }
            console.log(id)
            setCourseData((oldRows) => [...oldRows, { id, name: '', year: '', hours: '' }]);
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
                    // csv.current.value=(json2csv(courseData))
                    console.log(courseData)
                    setDefaultCSV(json2csv(courseData))
                    setCsvShow(true)
                }, [courseData])}>
                    📝 Edit As CSV

                </Button>
                {buttons}
            </GridToolbarContainer>

        )
    }, [rowModesModel, courseData]); 



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
        &:focus-visible {
          outline: 0;
        }
      `,
    );

    return (
        <main>
            <Navbar />
            <h1 style={{ marginRight: "10px" }}>Courses</h1>

            <Container fluid style={{ maxWidth: '100%' }}>
                <Row className="h-32">
                    <div style={{ width: '100%', padding: '1rem' }}>
                        <DataGrid
                            editMode="row"
                            rows={courseData}
                            columns={tableColumns}
                            pageSizeOptions={[10000]}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}

                            slotProps={{
                                toolbar: { setCourseData, setRowModesModel, id },
                            }}
                            checkboxSelection={true}
                            disableMultipleRowSelection={true}
                            onRowSelectionModelChange={(newSelection) => {
                                console.log(newSelection[0])
                                setId(newSelection[0])
                            }}

                        />
                    </div>
                </Row>
            </Container>

            <Modal open={csvShow} onClose={handleCSVClose}>
                <Box sx={{
                    position: 'absolute',
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
                    <Button className="!tw-m-2" variant="contained" onClick={() => {
                        const csvText = csv.current.value;
                        setCourseData(csv2json(csvText));
                        handleCSVClose();
                    }}>
                        Add
                    </Button>
                </Box>
            </Modal>

            {/* <Button onClick={() => { push("/courses/create_new_course") }}>Create a new course</Button> */}
        </main >

    );
}
