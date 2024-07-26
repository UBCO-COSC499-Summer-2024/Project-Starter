// this file uses copilot auto compleet in all around areas
'use client'
import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import { csv2json, json2csv } from 'json-2-csv';
import Navbar from "@/app/components/NavBar"
import { createClient } from '@supabase/supabase-js'
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
import { useState, useEffect, useRef } from "react";
import { DataGrid, GridSlots, GridToolbarContainer, GridRowModes, GridActionsCellItem } from '@mui/x-data-grid';
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
    useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase.from("v_evaluations_page").select();
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
        { field: 'evaluation_type', headerName: 'Evaluation Type', width: 200, editable: false },
        { field: 'instructor', headerName: 'Instructor', width: 150, editable: false },
        { field: 'course', headerName: 'Course', width: 150, editable: false },
        { field: 'service_role', headerName: 'Service Role', width: 200, editable: false },
        { field: 'question_num', headerName: 'Question', width: 100, editable: false },
        { field: 'question', headerName: 'Question Text', width: 300, editable: false },
        { field: 'answer', headerName: 'Answer', width: 150, editable: true },
        { field: 'evaluation_date', headerName: 'Date', width: 200, editable: false }
    ]

    const [TimeData, setTimeData] = useState([]);
    const { push } = useRouter();
    const [defaultCSV, setDefaultCSV] = useState("");
    const [id, setId] = useState(0);
    const EditToolbar = (props) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
            return (
                <GridToolbarContainer>
                    <Button onClick={handleSaveClick(id)}>💾 Save</Button>
                    <Button className="textPrimary" onClick={handleCancelClick(id)} color="inherit">❌ Cancel</Button>
                </GridToolbarContainer>
            );
        }

        return (
            <GridToolbarContainer>
                <Button color="primary" onClick={() => push("/evaluations/enter_evaluation")}>➕ Add record</Button>
                <Button color="primary" onClick={() => {
                    setDefaultCSV(json2csv(TimeData));
                    setCsvShow(true);
                }}>📝 Edit As CSV</Button>
                <Button className="textPrimary" onClick={handleEditClick(id)} color="inherit">✏️Edit</Button>
                <Button onClick={handleDeleteClick(id)} color="inherit">🗑️ Delete</Button>
            </GridToolbarContainer>
        );
    }

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
        &:focus-visible {
          outline: 0;
        }
      `,
    );

    const csv = useRef(null);
    const [rowModesModel, setRowModesModel] = useState({});
    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
        if(!confirm("Are you sure you want to delete this record?")) return;
        const error = (await supabase.from("evaluation_entry").delete().eq("evaluation_entry_id", id)).error;
        if(error) {
            console.error("Error deleting record:", error);
            return;
        }
        setTimeData(TimeData.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    }
    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    return (
        <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <h1 style={{ marginRight: "10px" }}>Evaluations</h1>
            <Button onClick={() => push("/evaluations/enter_evaluation")}>Enter Evaluation</Button>

            <Container fluid style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Row style={{ flex: 1 }}>
                    <div style={{ flex: 1, padding: '1rem' }}>
                        <DataGrid
                            editMode="row"
                            rows={TimeData}
                            columns={tableColumns}
                            pageSizeOptions={[10000]}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                            rowModesModel={rowModesModel}
                            slotProps={{
                                toolbar: { setTimeData, setRowModesModel },
                            }}
                            checkboxSelection
                            disableMultipleRowSelection
                            onRowSelectionModelChange={(newSelection) => {
                                setId(newSelection[0]);
                            }}
                            autoHeight
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
                    <Button className="!tw-m-2" variant="contained" onClick={() => {
                        const csvText = csv.current.value;
                        setTimeData(csv2json(csvText))
                        handleCSVClose()
                    }}>Add</Button>
                </Box>
            </Modal>
        </main>
    );
}
