'use client'
import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import { csv2json, json2csv } from 'json-2-csv';
import Navbar from "@/app/components/NavBar"
import { Row } from "react-bootstrap";
import { Button, Modal, Typography, Box, styled } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
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
import { DataGrid, GridSlots, GridToolbarContainer, GridRowModes } from '@mui/x-data-grid';
import React from "react";
import SearchModal from '@/app/components/SearchModal';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
import supabase from "@/app/components/supabaseClient";

const StyledButton = styled(Button)(
    ({ theme }) => `
        color: ${theme.palette.primary.main};
        background-color: ${theme.palette.background.default};
        border: 1px solid ${theme.palette.primary.main};
        padding: 4px 8px;
        font-size: 0.875rem;
        text-transform: none;  // Ensures text is not capitalized
        &:hover {
            background-color: ${theme.palette.primary.light};
        }
    `
);

export default function Evaluations() {
    const [TimeData, setTimeData] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [csvShow, setCsvShow] = useState(false);
    const [defaultCSV, setDefaultCSV] = useState("");
    const { push } = useRouter();
    const csv = useRef(null);
    const [id, setId] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentEditRow, setCurrentEditRow] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                var { data: evalData, error } = await supabase.from("v_evaluations_page").select();
                if (error) throw error;
                setTimeData(evalData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, []);

    const handleOpenModal = (type, row) => {
        setModalType(type);
        setCurrentEditRow(row);
        setModalOpen(true);
    };

    const handleSelect = (selectedItem) => {
        let newRow = { ...currentEditRow };

        if (modalType === 'instructor') {
            newRow = { ...newRow, instructor_id: selectedItem.id, instructor_full_name: selectedItem.name };
        } else if (modalType === 'course') {
            newRow = { ...newRow, course_id: selectedItem.id, course: selectedItem.name };
        } else if (modalType === 'service_role') {
            newRow = { ...newRow, service_role_id: selectedItem.id, service_role: selectedItem.name };
        }

        const newRows = TimeData.map(row => row.id === currentEditRow.id ? newRow : row);
        setTimeData(newRows);
        setModalOpen(false);
    };

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 10, editable: false },
        { field: 'evaluation_type', headerName: 'Evaluation Type', width: 200, editable: false },
        {
            field: 'instructor_full_name',
            headerName: 'Instructor',
            width: 150,
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                const canEdit = params.row.requires_instructor !== false;
                return isInEditMode && canEdit ? (
                    <StyledButton onClick={() => handleOpenModal('instructor', params.row)}>{params.row.instructor_full_name}</StyledButton>
                ) : (
                    <span>{params.row.instructor_full_name}</span>
                );
            }
        },
        {
            field: 'course',
            headerName: 'Course',
            width: 150,
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                const canEdit = params.row.requires_course !== false;
                return isInEditMode && canEdit ? (
                    <StyledButton onClick={() => handleOpenModal('course', params.row)}>{params.row.course}</StyledButton>
                ) : (
                    <span>{params.row.course}</span>
                );
            }
        },
        {
            field: 'service_role',
            headerName: 'Service Role',
            width: 200,
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                const canEdit = params.row.requires_service_role !== false;
                return isInEditMode && canEdit ? (
                    <StyledButton onClick={() => handleOpenModal('service_role', params.row)}>{params.row.service_role}</StyledButton>
                ) : (
                    <span>{params.row.service_role}</span>
                );
            }
        },
        { field: 'question_num', headerName: 'Question', width: 100, editable: true },
        { field: 'question', headerName: 'Question Text', width: 300, editable: true },
        { field: 'answer', headerName: 'Answer', width: 150, editable: true },
        { field: 'evaluation_date', headerName: 'Date', width: 200, editable: true }
    ];

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
                <Button className="textPrimary" onClick={handleEditClick(id)} color="inherit">✏️ Edit</Button>
                <Button onClick={handleDeleteClick(id)} color="inherit">🗑️ Delete</Button>
            </GridToolbarContainer>
        );
    }

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
        if (!confirm("Are you sure you want to delete this record?")) return;
        const error = (await supabase.from("evaluation_entry").delete().eq("evaluation_entry_id", id)).error;
        if (error) {
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

    const handleCSVClose = () => setCsvShow(false);

    const handleCellClick = (params, event) => {
        if (params.field === 'instructor_full_name' || params.field === 'course' || params.field === 'service_role') {
            const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
            const canEdit = (params.field === 'instructor_full_name' && params.row.requires_instructor !== false) ||
                (params.field === 'course' && params.row.requires_course !== false) ||
                (params.field === 'service_role' && params.row.requires_service_role !== false);

            if (isInEditMode && canEdit) {
                event.stopPropagation();
                handleOpenModal(params.field.replace('_full_name', ''), params.row);
            }
        }
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
                            columns={tableColumns.map(column => ({
                                ...column,
                                renderCell: (params) => {
                                    if (params.field === 'instructor_full_name' || params.field === 'course' || params.field === 'service_role') {
                                        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                                        const canEdit = (params.field === 'instructor_full_name' && params.row.requires_instructor !== false) ||
                                            (params.field === 'course' && params.row.requires_course !== false) ||
                                            (params.field === 'service_role' && params.row.requires_service_role !== false);

                                        if (isInEditMode && canEdit) {
                                            return <StyledButton onClick={() => handleOpenModal(params.field.replace('_full_name', ''), params.row)}>{params.value}</StyledButton>;
                                        }
                                    }
                                    return <span>{params.value}</span>;
                                }
                            }))}
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
                            onCellClick={handleCellClick}
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
                        setTimeData(csv2json(csvText));
                        handleCSVClose();
                    }}>Add</Button>
                </Box>
            </Modal>

            <SearchModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                handleSelect={handleSelect}
                type={modalType}
            />
        </main>
    );
}
