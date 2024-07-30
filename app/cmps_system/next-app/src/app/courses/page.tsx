'use client'
import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { csv2json, json2csv } from 'json-2-csv';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Modal, Typography, Box, styled, Select, MenuItem, TextField } from '@mui/material';
import { Row } from "react-bootstrap";
import { DataGrid, GridSlots, GridToolbarContainer, GridRowModes, GridRowEditStopReasons } from '@mui/x-data-grid';
import React from "react";
import Navbar from "@/app/components/NavBar";
import Container from 'react-bootstrap/Container';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import supabase from "@/app/components/supabaseClient";
import getUserType from "../components/getUserType";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Home() {
    const [courseData, setCourseData] = useState([]);
    const { push } = useRouter();
    const [csvShow, setCsvShow] = useState(false);
    const [csvData, setCsvData] = useState("");
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [userType, setUserType] = useState(null);
    const csv = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase.from("v_courses_with_instructors").select();
                if (error) throw error;
                setCourseData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setUserType(await getUserType());
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

    const renderSessionSelector = (params) => {
        return (
            <Select
                value={params.value || ''}
                onChange={(event) => {
                    const row = params.row;
                    row.session = event.target.value;
                    params.api.setEditCellValue({ id: row.id, field: 'session', value: row.session });
                }}
            >
                <MenuItem value="Winter">Winter</MenuItem>
                <MenuItem value="Summer">Summer</MenuItem>
            </Select>
        );
    };

    const renderTermSelector = (params) => {
        return (
            <Select
                value={params.value || ''}
                onChange={(event) => {
                    const row = params.row;
                    row.term = event.target.value;
                    params.api.setEditCellValue({ id: row.id, field: 'term', value: row.term });
                }}
            >
                <MenuItem value="Term 1">Term 1</MenuItem>
                <MenuItem value="Term 2">Term 2</MenuItem>
                <MenuItem value="Term 1-2">Term 1-2</MenuItem>
            </Select>
        );
    };

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 50, editable: false },
        { field: 'subject_code', headerName: 'Subject', flex: 1, editable: userType!="instructor" },
        { field: 'course_num', headerName: 'Course No.', flex: 1, editable: userType!="instructor" },
        {
            field: 'section_num',
            headerName: 'Section',
            flex: 1,
            editable: userType!="instructor",
            renderCell: renderSectionNumber
        },
        { field: 'course_title', headerName: 'Course Title', flex: 2, editable: userType!="instructor" },
        { field: 'academic_year', headerName: 'Academic Year', flex: 1, editable: userType!="instructor" },
        {
            field: 'session',
            headerName: 'Session',
            flex: 1,
            editable: userType!="instructor",
            renderEditCell: renderSessionSelector
        },
        {
            field: 'term',
            headerName: 'Term',
            flex: 1,
            editable: userType!="instructor",
            renderEditCell: renderTermSelector
        },
        {
            field: 'instructor_names',
            headerName: 'Instructors',
            flex: 2,
            renderCell: renderInstructorNames
        },
        { field: 'num_students', headerName: 'Students', flex: 1, editable: userType!="instructor" },
        { field: 'num_tas', headerName: 'TAs', flex: 1, editable: userType!="instructor" },
        { field: 'average_grade', headerName: 'Avg. Grade', flex: 1, editable: userType!="instructor" },
        { field: 'location', headerName: 'Location', flex: 1, editable: userType!="instructor" },
    ];

    const handleSaveClick = async () => {
        setRowModesModel({});
        setIsEditing(false);
    };

    const handleDeleteClick = async () => {
        if (confirm("Are you sure you want to delete the selected courses? This action is not recoverable!")) {
            const deletions = selectedRows.map(async (id) => {
                const response = await supabase.from('course').delete().eq("course_id", id);
                if (response.error) {
                    alert(`Error deleting course ${id}: ${response.error.message}`);
                }
            });

            await Promise.all(deletions);
            setCourseData(courseData.filter((row) => !selectedRows.includes(row.id)));
            setIsEditing(false);
        }
    };

    const handleCancelClick = () => {
        setRowModesModel({});
        setIsEditing(false);
    }

    const handleEditClick = () => {
        if (selectedRows.length === 0) {
            alert("Please select a row first.");
            return;
        }

        const newModel = {};
        selectedRows.forEach(id => {
            newModel[id] = { mode: GridRowModes.Edit };
        });
        setRowModesModel(newModel);
        setIsEditing(true);
    };

    const handleProcessRowUpdate = async (newRow) => {
        const oldRow = courseData.find((row) => row.id === newRow.id);
        if (!oldRow) return oldRow;

        if (newRow.location.split(" ").length !== 2) {
            alert("Location should be in format of 'building room_num'");
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [newRow.id]: { mode: GridRowModes.View, ignoreModifications: true },
            }));
            return oldRow;
        }

        const { error } = await supabase.from("course").update({
            course_id: newRow.id,
            course_title: newRow.course_title,
            building: newRow.location.split(" ")[0],
            room_num: newRow.location.split(" ")[1],
            num_students: newRow.num_students,
            num_tas: newRow.num_tas,
            term: newRow.term,
            academic_year: newRow.academic_year,
            subject_code: newRow.subject_code,
            course_num: newRow.course_num,
            section_num: newRow.section_num,
            average_grade: newRow.average_grade,
            year_level: newRow.year_level,
            session: newRow.session
        }).eq("course_id", newRow.id);

        if (error) {
            alert(`Error On Row ${newRow.id}: ${error.message}`);
            return oldRow;
        }

        return newRow;
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && isEditing) {
            event.preventDefault();
            handleSaveClick();
        }
    };

    useEffect(() => {
        if (isEditing) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditing]);

    const EditToolbar = useCallback((props) => {
        if(userType=="instructor") return <></>;
        const { setCourseData, setRowModesModel } = props;

        const handleClick = () => {
            push('/courses/create_new_course');
        };

        return (
            <GridToolbarContainer>
                <Button onClick={handleClick}>
                    ➕ Create New Course
                </Button>

                <Button onClick={useCallback(async () => {
                    const { data, error } = await supabase.from("course").select();
                    if (error) {
                        console.error("Error fetching course data:", error);
                        return;
                    }
                    const csvString = await json2csv(data);
                    setCsvData(csvString);
                    setCsvShow(true);
                }, [])}>
                    📝 Edit As CSV
                </Button>

                {!isEditing && (
                    <Button
                        className="textPrimary"
                        onClick={handleEditClick}
                        color="inherit"
                    >✏️ Edit</Button>
                )}

                {isEditing && (
                    <>
                        <Button
                            onClick={handleSaveClick}
                            color="inherit"
                        >💾 Save</Button>

                        <Button
                            className="textPrimary"
                            onClick={handleCancelClick}
                            color="inherit"
                        >❌ Cancel</Button>
                    </>
                )}

                <Button
                    onClick={handleDeleteClick}
                    color="inherit"
                >🗑️ Delete</Button>
            </GridToolbarContainer>
        );
    }, [rowModesModel, courseData, selectedRows, isEditing]);

    const handleCSVClose = () => setCsvShow(false);

    const handleCSVApply = async () => {
        try {
            const newJsonData = await csv2json(csv.current.value);

            // Fetch current data from the database
            const { data: currentData, error: fetchError } = await supabase.from("course").select();
            if (fetchError) {
                alert(`Error fetching current data: ${fetchError.message}`);
                return;
            }

            // Find IDs to delete
            const currentIds = currentData.map(row => row.course_id);
            const newIds = newJsonData.map(row => row.course_id);
            const idsToDelete = currentIds.filter(id => !newIds.includes(id));

            // Delete removed rows
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await supabase.from("course").delete().in("course_id", idsToDelete);
                if (deleteError) {
                    alert(`Error deleting rows: ${deleteError.message}`);
                    return;
                }
            }

            // Upsert new and updated rows
            for (const newRow of newJsonData) {
                newRow.course_id = newRow.course_id ? newRow.course_id : undefined
                const { error: upsertError } = await supabase.from("course").upsert(newRow);
                if (upsertError) {
                    alert(`Error on row ${newRow.course_id}: ${upsertError.message}`);
                    return;
                }
            }

            // Refresh the data in the table
            const { data: updatedData, error: refreshError } = await supabase.from("v_courses_with_instructors").select();
            if (refreshError) throw refreshError;
            setCourseData(updatedData);

            handleCSVClose();
        } catch (error) {
            alert(`Error parsing CSV: ${error.message}`);
        }
    };

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
                            rowModesModel={rowModesModel}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                            slotProps={{
                                toolbar: { setCourseData, setRowModesModel },
                            }}
                            onRowEditStop={(params, event) => {
                                if (params.reason === GridRowEditStopReasons.rowFocusOut) {
                                    event.defaultMuiPrevented = true;
                                }
                            }}
                            checkboxSelection={true}
                            onRowSelectionModelChange={(newSelection) => {
                                setSelectedRows(newSelection);
                            }}
                            processRowUpdate={handleProcessRowUpdate}
                            onProcessRowUpdateError={(error) => {
                                console.error("Row update error:", error);
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
                    <Typography id="modal-modal-title" variant="h8" component="h2">
                        You can leave 'course_id' empty and it will be auto-generated.
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextField
                            multiline
                            rows={15}
                            fullWidth
                            defaultValue={csvData}
                            inputRef={csv}
                        />
                    </Typography>

                    <Button className="!tw-m-2" variant="outlined" onClick={handleCSVClose}>Cancel</Button>
                    <Button className="!tw-m-2" variant="contained" onClick={handleCSVApply}>Apply</Button>
                </Box>
            </Modal>
        </main>
    );
}