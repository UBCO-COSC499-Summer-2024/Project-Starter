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
import Link from 'next/link';
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
    const [selectedRows, setSelectedRows] = useState([]);
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
        const updatedRows = TimeData.map(row => {
            if (selectedRows.includes(row.id)) {
                let updatedRow = { ...row };
                if (modalType === 'instructor' && row.requires_instructor !== false) {
                    updatedRow = { ...updatedRow, instructor_id: selectedItem.id, instructor_full_name: selectedItem.name };
                } else if (modalType === 'course' && row.requires_course !== false) {
                    updatedRow = { ...updatedRow, course_id: selectedItem.id, course: selectedItem.name };
                } else if (modalType === 'service_role' && row.requires_service_role !== false) {
                    updatedRow = { ...updatedRow, service_role_id: selectedItem.id, service_role: selectedItem.name };
                }
                return updatedRow;
            }
            return row;
        });

        setTimeData(updatedRows);
        setModalOpen(false);
    };

    const handleSaveClick = async () => {
        const rowsToUpdate = TimeData.filter(row => selectedRows.includes(row.id));

        for (const row of rowsToUpdate) {
            const { error } = await supabase
                .from('evaluation_entry')
                .update({
                    evaluation_type_id: row.evaluation_type_id,
                    metric_num: row.metric_num,
                    course_id: row.course_id,
                    instructor_id: row.instructor_id,
                    service_role_id: row.service_role_id,
                    evaluation_date: row.evaluation_date,
                    answer: row.answer
                })
                .eq('evaluation_entry_id', row.id);

            if (error) {
                console.error("Error updating record:", error);
            }
        }

        setRowModesModel(prev => {
            const updated = { ...prev };
            selectedRows.forEach(id => {
                updated[id] = { mode: GridRowModes.View };
            });
            return updated;
        });
    };

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 10, editable: false },
        {
            field: 'evaluation_type',
            headerName: 'Evaluation Type',
            width: 200,
            editable: false,
            renderCell: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                return isInEditMode ? (
                    <span>{params.row.evaluation_type}</span>
                ) : (
                    <Link href={`/evaluations/evaluation_type_info?id=${params.row.evaluation_type_id}`} passHref>
                        {params.row.evaluation_type}
                    </Link>
                );
            }
        },
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
                    <Link href={`/instructors/instructor_info?id=${params.row.instructor_id}`} passHref>
                        {params.row.instructor_full_name}
                    </Link>
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
                    <Link href={`/courses/course_info?id=${params.row.course_id}`} passHref>
                        {params.row.course}
                    </Link>
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
                    <Link href={`/service_roles/service_role_info?id=${params.row.service_role_id}`} passHref>
                        {params.row.service_role}
                    </Link>
                );
            }
        },
        { field: 'question_num', headerName: 'Question', width: 100, editable: true },
        { field: 'question', headerName: 'Question Text', width: 300, editable: true },
        { field: 'answer', headerName: 'Answer', width: 150, editable: true },
        { field: 'evaluation_date', headerName: 'Date', width: 200, editable: true }
    ];

    const EditToolbar = (props) => {
        const isInEditMode = selectedRows.some(id => rowModesModel[id]?.mode === GridRowModes.Edit);

        if (isInEditMode) {
            return (
                <GridToolbarContainer>
                    <Button onClick={handleSaveClick}>💾 Save</Button>
                    <Button className="textPrimary" onClick={handleCancelClick} color="inherit">❌ Cancel</Button>
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
                <Button className="textPrimary" onClick={handleEditClick} color="inherit">✏️ Edit</Button>
                <Button onClick={handleDeleteClick} color="inherit">🗑️ Delete</Button>
            </GridToolbarContainer>
        );
    };

    const handleDeleteClick = async () => {
        if (!confirm("Are you sure you want to delete the selected records?")) return;
        for (const id of selectedRows) {
            const error = (await supabase.from("evaluation_entry").delete().eq("evaluation_entry_id", id)).error;
            if (error) {
                console.error("Error deleting record:", error);
                return;
            }
        }
        setTimeData(TimeData.filter((row) => !selectedRows.includes(row.id)));
        setSelectedRows([]);
    };

    const handleCancelClick = () => {
        setRowModesModel(prev => {
            const updated = { ...prev };
            selectedRows.forEach(id => {
                updated[id] = { mode: GridRowModes.View, ignoreModifications: true };
            });
            return updated;
        });
    };

    const handleEditClick = () => {
        setRowModesModel(prev => {
            const updated = { ...prev };
            selectedRows.forEach(id => {
                updated[id] = { mode: GridRowModes.Edit };
            });
            return updated;
        });
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
                                    if (params.field === 'evaluation_type') {
                                        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                                        return isInEditMode ? (
                                            <span>{params.row.evaluation_type}</span>
                                        ) : (
                                            <Link href={`/evaluations/evaluation_type_info?id=${params.row.evaluation_type_id}`} passHref>
                                                {params.row.evaluation_type}
                                            </Link>
                                        );
                                    }
                                    if (params.field === 'instructor_full_name') {
                                        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                                        const canEdit = params.row.requires_instructor !== false;
                                        return isInEditMode && canEdit ? (
                                            <StyledButton onClick={() => handleOpenModal('instructor', params.row)}>{params.row.instructor_full_name}</StyledButton>
                                        ) : (
                                            <Link href={`/instructors/instructor_info?id=${params.row.instructor_id}`} passHref>
                                                {params.row.instructor_full_name}
                                            </Link>
                                        );
                                    }
                                    if (params.field === 'course') {
                                        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                                        const canEdit = params.row.requires_course !== false;
                                        return isInEditMode && canEdit ? (
                                            <StyledButton onClick={() => handleOpenModal('course', params.row)}>{params.row.course}</StyledButton>
                                        ) : (
                                            <Link href={`/courses/course_info?id=${params.row.course_id}`} passHref>
                                                {params.row.course}
                                            </Link>
                                        );
                                    }
                                    if (params.field === 'service_role') {
                                        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                                        const canEdit = params.row.requires_service_role !== false;
                                        return isInEditMode && canEdit ? (
                                            <StyledButton onClick={() => handleOpenModal('service_role', params.row)}>{params.row.service_role}</StyledButton>
                                        ) : (
                                            <Link href={`/service_roles/service_role_info?id=${params.row.service_role_id}`} passHref>
                                                {params.row.service_role}
                                            </Link>
                                        );
                                    }
                                    return <span>{params.value}</span>;
                                }
                            }))}
                            pageSizeOptions={[10000]}
                            initialState={{
                                sorting: {
                                    sortModel: [
                                        { field: 'evaluation_date', sort: 'desc' },
                                        { field: 'evaluation_type', sort: 'asc' },
                                        { field: 'instructor_full_name', sort: 'asc' },
                                        { field: 'course', sort: 'asc' },
                                        { field: 'service_role', sort: 'asc' },
                                        { field: 'question_num', sort: 'asc' },
                                    ],
                                },
                            }}
                            slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                            rowModesModel={rowModesModel}
                            slotProps={{
                                toolbar: { setTimeData, setRowModesModel },
                            }}
                            checkboxSelection
                            onRowSelectionModelChange={(newSelection) => {
                                setSelectedRows(newSelection);
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
