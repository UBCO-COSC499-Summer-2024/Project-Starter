'use client'
import { useEffect, useRef, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { csv2json, json2csv } from 'json-2-csv';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Modal, Typography, Box, styled, TextareaAutosize as BaseTextareaAutosize } from '@mui/material';
import { Row } from "react-bootstrap";
import { DataGrid, GridSlots, GridToolbarContainer } from '@mui/x-data-grid';
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

export default function EvaluationTypes() {
    const [evaluationTypeData, setEvaluationTypeData] = useState([]);
    const { push } = useRouter();
    const [defaultCSV, setDefaultCSV] = useState("");
    const [csvShow, setCsvShow] = useState(false);
    const csv = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
                const { data, error } = await supabase.from("v_evaluation_type_info").select();
                if (error) throw error;
                setEvaluationTypeData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, []);

    const handleEvaluationTypeClick = (id, event) => {
        event.preventDefault();
        push(`/evaluations/evaluation_type_info?id=${id}`);
    };

    const renderEvaluationTypeName = (params) => {
        return (
            <a
                href={`/evaluations/evaluation_type_info?id=${params.row.id}`}
                onClick={(event) => handleEvaluationTypeClick(params.row.id, event)}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
                {params.value}
            </a>
        );
    };

    const processRowUpdate = async (newRow, oldRow) => {
        try {
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
            const { error } = await supabase
                .from('evaluation_type')
                .update({
                    evaluation_type_name: newRow.name,
                    description: newRow.description,
                    requires_course: newRow.requires_course,
                    requires_instructor: newRow.requires_instructor,
                    requires_service_role: newRow.requires_service_role
                })
                .eq('evaluation_type_id', newRow.id);

            if (error) throw error;
            return newRow;
        } catch (error) {
            console.error("Error updating data:", error);
            return oldRow;
        }
    };

    const tableColumns = [
        { field: 'name', headerName: 'Evaluation Type', flex: 2, editable: true, renderCell: renderEvaluationTypeName },
        { field: 'description', headerName: 'Description', flex: 3, editable: true },
        { field: 'num_entries', headerName: 'Number of Questions', flex: 1, editable: false },
        { field: 'date_added', headerName: 'Date Added', flex: 1, editable: true },
        { field: 'requires_course', headerName: 'Requires Course', flex: 1, editable: false, type: 'boolean' },
        { field: 'requires_instructor', headerName: 'Requires Instructor', flex: 1, editable: false, type: 'boolean' },
        { field: 'requires_service_role', headerName: 'Requires Service Role', flex: 1, editable: false, type: 'boolean' },
    ];

    const EditToolbar = () => {
        return (
            <GridToolbarContainer>
                <Button color="primary" onClick={() => { push("/evaluations/create_new_evaluation_type") }}>
                    ➕ Add record
                </Button>

                <Button color="primary" onClick={() => {
                    setDefaultCSV(json2csv(evaluationTypeData));
                    setCsvShow(true);
                }}>
                    ✏️ Edit As CSV
                </Button>
            </GridToolbarContainer>
        );
    };

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
            <h1 style={{ marginRight: "10px" }}>Evaluation Types</h1>

            <Container fluid style={{ maxWidth: '100%' }}>
                <Row className="h-32">
                    <div style={{ width: '100%', padding: '1rem' }}>
                        <DataGrid
                            editMode="row"
                            rows={evaluationTypeData}
                            columns={tableColumns}
                            pageSizeOptions={[10000]}
                            processRowUpdate={processRowUpdate}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                            autoHeight
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
                        setEvaluationTypeData(csv2json(csvText).map((item: { evaluation_type_id: string }) => ({
                            ...item,
                            id: item.evaluation_type_id
                        })));
                        handleCSVClose();
                    }}>
                        Save
                    </Button>
                </Box>
            </Modal>
        </main>
    );
}
